
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { processOMRImage } from '../services/omrService';
import { Question, OMRData, ScanResult } from '../types';

interface Props {
  answerKey: Question[];
  onResult: (data: OMRData) => void;
  onBack: () => void;
}

export const OMRScanner: React.FC<Props> = ({ answerKey, onResult, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Could not access camera. Please ensure permissions are granted.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      try {
        const response = await processOMRImage(base64Image, answerKey);
        
        const results: ScanResult[] = answerKey.map(correctQ => {
          const detected = response.detectedAnswers.find(da => da.q === correctQ.id);
          const detectedOption = (detected?.o || 'NONE') as any;
          return {
            questionId: correctQ.id,
            detectedOption,
            isCorrect: detectedOption === correctQ.correctOption
          };
        });

        const totalScore = results.filter(r => r.isCorrect).length;
        
        onResult({
          results,
          totalScore,
          totalQuestions: answerKey.length,
          rawJson: JSON.stringify(response, null, 2)
        });
      } catch (err) {
        setError("Recognition failed. Please ensure the sheet is well-lit and fully visible.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-2xl aspect-[3/4] sm:aspect-square md:aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[85%] h-[85%] border-2 border-dashed border-indigo-400/50 rounded-2xl flex flex-col items-center justify-between p-8">
            <div className="flex justify-between w-full">
               <div className="w-8 h-8 border-t-4 border-l-4 border-indigo-500"></div>
               <div className="w-8 h-8 border-t-4 border-r-4 border-indigo-500"></div>
            </div>
            
            <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-full backdrop-blur-md">
              Align Sheet within Frame
            </div>

            <div className="flex justify-between w-full">
               <div className="w-8 h-8 border-b-4 border-l-4 border-indigo-500"></div>
               <div className="w-8 h-8 border-b-4 border-r-4 border-indigo-500"></div>
            </div>
          </div>
          
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[scan_3s_linear_infinite] shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-bold animate-pulse">Analyzing OMR Sheet...</p>
            <p className="text-sm text-slate-400 mt-2">Gemini is processing the bubbles</p>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full max-w-2xl p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-center flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex gap-4 w-full max-w-2xl">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Edit Key
        </button>
        <button
          onClick={captureAndScan}
          disabled={isProcessing}
          className="flex-[2] py-4 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-50 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
        >
          {isProcessing ? 'Processing...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              SCAN NOW
            </>
          )}
        </button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
