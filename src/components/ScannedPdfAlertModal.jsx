/**
 * Claritus Scanned PDF Alert Modal
 * Triggered when uploaded document yields < 10 readable characters.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { FileWarning, Copy, X } from 'lucide-react';

export default function ScannedPdfAlertModal() {
  const { scannedPdfDetected, dispatch } = useLegal();

  if (!scannedPdfDetected) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-labelledby="scanned-pdf-title"
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-fade-in"
      >
        <div className="flex items-start justify-between">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-lg">
            <FileWarning className="w-6 h-6" />
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_SCANNED_PDF', payload: false })}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 id="scanned-pdf-title" className="text-lg font-bold text-slate-100 mt-4">
          Image-Only Scanned PDF Detected
        </h3>
        
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
          The uploaded file appears to be an image scan or flattened image without selectable digital text. Claritus does not perform automatic image OCR.
        </p>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4">
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Recommended Solution:
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Copy the text from your document viewer or PDF editor and paste it directly into the <strong>Text Input Box</strong> for full instant legal analysis.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => dispatch({ type: 'SET_SCANNED_PDF', payload: false })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            Got It, I'll Paste Text
          </button>
        </div>
      </div>
    </div>
  );
}
