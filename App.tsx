
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AnswerKeyConfig } from './components/AnswerKeyConfig';
import { OMRScanner } from './components/OMRScanner';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AppState, Question, OMRData } from './types';

const INITIAL_QUESTIONS: Question[] = [
  { id: 1, correctOption: 'A' },
  { id: 2, correctOption: 'B' },
  { id: 3, correctOption: 'C' },
  { id: 4, correctOption: 'D' },
  { id: 5, correctOption: 'A' },
  { id: 6, correctOption: 'B' },
  { id: 7, correctOption: 'C' },
  { id: 8, correctOption: 'D' },
  { id: 9, correctOption: 'A' },
  { id: 10, correctOption: 'B' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [scanResult, setScanResult] = useState<OMRData | null>(null);

  const handleStartScanning = () => {
    setAppState(AppState.SCANNING);
  };

  const handleScanComplete = (data: OMRData) => {
    setScanResult(data);
    setAppState(AppState.RESULTS);
  };

  const handleReset = () => {
    setScanResult(null);
    setAppState(AppState.SCANNING);
  };

  const handleEditKey = () => {
    setAppState(AppState.SETUP);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-12 text-center">
        {appState === AppState.SETUP && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              Digitize Your Assessment
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Set up your answer key and let Gemini's advanced vision check your physical OMR sheets in seconds.
            </p>
          </div>
        )}
        
        {appState === AppState.SCANNING && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-2">Live Scanner</h2>
            <p className="text-slate-400">Position your sheet clearly for AI verification</p>
          </div>
        )}

        {appState === AppState.RESULTS && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-2">Evaluation Complete</h2>
            <p className="text-slate-400">Here's the performance analysis from the scanned sheet</p>
          </div>
        )}
      </div>

      <div className="transition-all duration-500">
        {appState === AppState.SETUP && (
          <AnswerKeyConfig 
            questions={questions} 
            onUpdate={setQuestions} 
            onStartScanning={handleStartScanning} 
          />
        )}

        {appState === AppState.SCANNING && (
          <OMRScanner 
            answerKey={questions} 
            onResult={handleScanComplete} 
            onBack={handleEditKey}
          />
        )}

        {appState === AppState.RESULTS && scanResult && (
          <ResultsDashboard 
            data={scanResult} 
            onReset={handleReset} 
          />
        )}
      </div>

      {/* Quick Access Floating Action (Optional) */}
      {appState === AppState.RESULTS && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setAppState(AppState.SETUP)}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-2xl border border-slate-700 flex items-center justify-center group"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
