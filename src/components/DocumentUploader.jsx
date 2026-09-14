/**
 * Claritus Primary Hero Document Reader & Uploader
 * Sleek compressed dropzone, elevated visual hierarchy,
 * solid filled emerald CTAs, and rich visual sample document cards.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { FileText, Upload, Sparkles, Copy, Check, FileCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { SYNTHETIC_SAMPLE_DOCS } from '../data/syntheticLegalDocs.js';

export default function DocumentUploader() {
  const { documentText, documentTitle, activePersona, dispatch } = useLegal();
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
    <div className="hero-card p-6 mb-8">
      {/* Primary Header & Active Document Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 font-bold shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                Active Document
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {documentText.split(/\s+/).length} words
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-100 mt-0.5">
              {documentTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <button
            onClick={() => {
              setIsEditingText(!isEditingText);
              setRawInput(documentText);
            }}
            className="btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 focus:ring-2 focus:ring-emerald-400"
          >
            {isEditingText ? 'Cancel Edit' : 'Edit / Paste Text'}
          </button>
          
          <button
            onClick={handleCopyText}
            className="btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNotice ? 'Copied' : 'Copy Text'}
          </button>
        </div>
      </div>

      {isEditingText ? (
        <div className="space-y-3 animate-fade-in">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={8}
            placeholder="Paste raw legal agreement text here..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingText(false)}
              className="btn-secondary px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyText}
              className="btn-primary px-5 py-2 text-xs"
            >
              Analyze Updated Text
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Compressed Sleek Horizontal Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 transition-all ${
              isDragging
                ? 'border-emerald-400 bg-emerald-950/30'
                : 'border-slate-800/90 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    Upload your Legal Agreement (.txt, .pdf, .docx)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Files are processed locally in your browser. For image scans, use text paste.
                  </p>
                </div>
              </div>

              <label className="btn-primary px-4 py-2 text-xs cursor-pointer shrink-0 flex items-center gap-1.5 focus:ring-2 focus:ring-emerald-400">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Rich Visual Synthetic Sample Cards */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Or Load Synthetic Sample Legal Contract:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {Object.entries(SYNTHETIC_SAMPLE_DOCS).map(([key, doc]) => {
                const isCurrent = documentTitle === doc.title;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      dispatch({ type: 'SET_DOCUMENT', payload: { text: doc.text, title: doc.title } });
                      dispatch({ type: 'SET_PERSONA', payload: doc.vertical });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      isCurrent
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {doc.verticalLabel}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-slate-500" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mt-1">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
