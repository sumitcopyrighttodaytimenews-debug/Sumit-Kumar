
import React from 'react';
import { Question, Option } from '../types';

interface Props {
  questions: Question[];
  onUpdate: (questions: Question[]) => void;
  onStartScanning: () => void;
}

export const AnswerKeyConfig: React.FC<Props> = ({ questions, onUpdate, onStartScanning }) => {
  const options: Option[] = ['A', 'B', 'C', 'D', 'E'];

  const handleOptionChange = (qId: number, option: Option) => {
    const updated = questions.map(q => 
      q.id === qId ? { ...q, correctOption: option } : q
    );
    onUpdate(updated);
  };

  const addQuestion = () => {
    onUpdate([...questions, { id: questions.length + 1, correctOption: 'A' }]);
  };

  const removeQuestion = () => {
    if (questions.length > 1) {
      onUpdate(questions.slice(0, -1));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
        <div>
          <h2 className="text-xl font-bold">Configure Answer Key</h2>
          <p className="text-sm text-slate-400">Define the correct options for your OMR sheet</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={removeQuestion}
            className="px-3 py-1 bg-slate-700 hover:bg-red-900/40 text-slate-300 rounded transition-colors"
          >
            -
          </button>
          <button 
            onClick={addQuestion}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group">
            <span className="font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Q{q.id.toString().padStart(2, '0')}</span>
            <div className="flex gap-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionChange(q.id, opt)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold ${
                    q.correctOption === opt
                      ? 'bg-indigo-600 border-indigo-400 text-white scale-110 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex justify-center">
        <button
          onClick={onStartScanning}
          className="w-full sm:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20"
        >
          Proceed to Scanning
        </button>
      </div>
    </div>
  );
};
