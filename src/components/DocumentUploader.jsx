/**
 * Claritus Document Reader & File Uploader
 * Supports file drag & drop, raw text paste, sample document picker,
 * and scanned image PDF detection with user fallback alert.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { FileText, Upload, Sparkles, Copy, Check } from 'lucide-react';
import { SYNTHETIC_SAMPLE_DOCS } from '../data/syntheticLegalDocs.js';

export default function DocumentUploader() {
  const { documentText, documentTitle, dispatch } = useLegal();
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [rawInput, setRawInput] = useState(documentText);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleFileUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (!text || text.trim().split(/\s+/).length < 5) {
        dispatch({ type: 'SET_SCANNED_PDF', payload: true });
        return;
      }
      dispatch({
        type: 'SET_DOCUMENT',
        payload: { text, title: file.name || "Uploaded Legal Document" }
      });
      setRawInput(text);
      setIsEditingText(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyText = () => {
    if (!rawInput || rawInput.trim().split(/\s+/).length < 5) {
      dispatch({ type: 'SET_SCANNED_PDF', payload: true });
      return;
    }
    dispatch({
      type: 'SET_DOCUMENT',
      payload: { text: rawInput, title: "Pasted Custom Document" }
    });
    setIsEditingText(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(documentText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 1500);
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {documentTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {documentText.split(/\s+/).length} words • Parsed digital sections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsEditingText(!isEditingText);
              setRawInput(documentText);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 focus:ring-2 focus:ring-emerald-400"
          >
            {isEditingText ? 'Cancel Edit' : 'Edit / Paste Text'}
          </button>
          
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNotice ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {isEditingText ? (
        <div className="space-y-3 animate-fade-in">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={10}
            placeholder="Paste raw legal agreement text here..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingText(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyText}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Analyze Updated Text
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-emerald-400 bg-emerald-950/20'
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Drag & Drop your Legal Document (.txt, .pdf, .docx)
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Text files are processed locally. For scanned image PDFs without selectable text, paste your text manually.
            </p>

            <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-400">
              <span>Browse File</span>
              <input
                type="file"
                accept=".txt,.pdf,.docx,.doc"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Synthetic Sample Loader Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-900 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Or load synthetic sample:
            </span>
            {Object.entries(SYNTHETIC_SAMPLE_DOCS).map(([key, doc]) => (
              <button
                key={key}
                onClick={() => {
                  dispatch({ type: 'SET_DOCUMENT', payload: { text: doc.text, title: doc.title } });
                  dispatch({ type: 'SET_PERSONA', payload: doc.vertical });
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 text-[11px] rounded transition-colors"
              >
                {doc.verticalLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
