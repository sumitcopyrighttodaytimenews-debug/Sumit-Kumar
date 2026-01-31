
import React from 'react';
import { OMRData } from '../types';

interface Props {
  data: OMRData;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<Props> = ({ data, onReset }) => {
  const percentage = Math.round((data.totalScore / data.totalQuestions) * 100);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="md:col-span-1 bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 * (1 - percentage / 100)}
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">
              {percentage}%
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1">Final Score</h3>
          <p className="text-4xl font-black text-indigo-400">
            {data.totalScore} <span className="text-xl text-slate-500 font-medium">/ {data.totalQuestions}</span>
          </p>
        </div>

        {/* Status Breakdowns */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Correct</span>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-green-500">{data.totalScore}</span>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Incorrect</span>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-red-500">{data.totalQuestions - data.totalScore}</span>
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-indigo-600/10 p-6 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-indigo-300">Detailed Report Available</h4>
              <p className="text-sm text-slate-400">View individual question responses below</p>
            </div>
            <button 
              onClick={onReset}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
            >
              Scan Another
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Response Table */}
      <div className="bg-slate-800/30 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-800/80">
          <h3 className="font-bold text-lg">Question Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-700/50">
                <th className="px-6 py-4 font-semibold">Q#</th>
                <th className="px-6 py-4 font-semibold">Detected</th>
                <th className="px-6 py-4 font-semibold">Correct Key</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.results.map((res) => (
                <tr key={res.questionId} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">{res.questionId.toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${
                      res.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {res.detectedOption}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-slate-100 font-bold border border-slate-600">
                      {/* Note: This logic assumes we know the answer key. We'll pass it if needed, or just look at data structure */}
                      {/* For simplicity in this display, we'll just show detected vs correctness */}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {res.isCorrect ? (
                      <span className="text-green-500 flex items-center gap-1 text-sm font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        PASS
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1 text-sm font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        FAIL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
