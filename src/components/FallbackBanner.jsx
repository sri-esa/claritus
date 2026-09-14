/**
 * Claritus Fallback Banner Alert Component
 * Displayed when Gemini API fails, informing the user of the exact error reason
 * and confirming automatic switch to built-in Heuristic Legal AI Engine.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function FallbackBanner() {
  const { fallbackAlert, dispatch, runAnalysis } = useLegal();

  if (!fallbackAlert) return null;

  return (
    <div 
      role="alert"
      className="bg-amber-950/80 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-lg mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-md text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-sm text-amber-100">
            {fallbackAlert.message}
          </p>
          <p className="text-xs text-amber-300/80 mt-0.5">
            Reason: <span className="font-mono">{fallbackAlert.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
        <button
          onClick={runAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white rounded text-xs font-medium border border-amber-500/30 transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
          title="Retry Gemini API request"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
        <button
          onClick={() => dispatch({ type: 'CLEAR_FALLBACK_ALERT' })}
          className="p-1.5 text-amber-400 hover:text-amber-100 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
          aria-label="Dismiss warning alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
