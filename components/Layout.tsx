
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">V</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Vision<span className="text-indigo-500">OMR</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="hidden sm:inline">AI-Powered Verification</span>
            <div className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-xs font-medium">System Ready</div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 py-6 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} VisionOMR - Senior Frontend Project
        </div>
      </footer>
    </div>
  );
};
