/**
 * Claritus Primary Hero Document Reader & Uploader
 * - Elevated hero-card surface (the current step focal point)
 * - Compressed dashed dropzone (matches content height)
 * - Solid emerald "Browse File" primary CTA
 * - Secondary utility buttons (Edit, Copy) use outline style
 * - Sample doc cards use card surface with subtle hover lift
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { FileText, Upload, Sparkles, Copy, Check, ArrowUpRight } from 'lucide-react';
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
      dispatch({ type: 'SET_DOCUMENT', payload: { text, title: file.name || 'Uploaded Legal Document' } });
      setRawInput(text);
      setIsEditingText(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleApplyText = () => {
    if (!rawInput || rawInput.trim().split(/\s+/).length < 5) {
      dispatch({ type: 'SET_SCANNED_PDF', payload: true });
      return;
    }
    dispatch({ type: 'SET_DOCUMENT', payload: { text: rawInput, title: 'Pasted Custom Document' } });
    setIsEditingText(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(documentText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 1500);
  };

  return (
    <div className="hero-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>

      {/* Header row: document status + utility actions */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '1rem',
        paddingBottom: '1.125rem', marginBottom: '1.125rem',
        borderBottom: '1px solid #1e293b'
      }}>
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            padding: '0.625rem',
            background: 'rgba(16,185,129,0.12)',
            borderRadius: '10px',
            color: '#10b981',
            display: 'flex',
            flexShrink: 0,
          }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#10b981',
                background: 'rgba(16,185,129,0.08)',
                padding: '0.125rem 0.5rem', borderRadius: '4px',
                border: '1px solid rgba(16,185,129,0.2)'
              }}>Active Document</span>
              <span style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                {documentText.split(/\s+/).length} words
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              {documentTitle}
            </h2>
          </div>
        </div>

        {/* Right: secondary utility buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => { setIsEditingText(!isEditingText); setRawInput(documentText); }}
            className="btn-secondary"
          >
            {isEditingText ? 'Cancel Edit' : 'Edit / Paste Text'}
          </button>
          <button onClick={handleCopyText} className="btn-secondary">
            {copiedNotice
              ? <><Check size={13} style={{ color: '#10b981' }} />Copied</>
              : <><Copy size={13} />Copy Text</>
            }
          </button>
        </div>
      </div>

      {/* Body: text editor OR dropzone + sample cards */}
      {isEditingText ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={8}
            placeholder="Paste raw legal agreement text here..."
            className="input-textarea"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button onClick={() => setIsEditingText(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleApplyText} className="btn-primary">Analyze Updated Text</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Compressed dashed dropzone — height matches content, not a large empty box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`dropzone${isDragging ? ' dragging' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Upload size={18} className="dropzone-icon" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Drop your contract here (.txt · .pdf · .docx)
                  </p>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.68rem', color: '#475569' }}>
                    Processed locally in browser — image-only PDFs must be pasted as text
                  </p>
                </div>
              </div>
              <label className="btn-primary" style={{ cursor: 'pointer', flexShrink: 0 }}>
                Browse File
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Sample doc cards */}
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={11} style={{ color: '#10b981' }} />
              Or load a synthetic sample
            </p>
            <div className="sample-grid">
              {Object.entries(SYNTHETIC_SAMPLE_DOCS).map(([key, doc]) => {
                const isCurrent = documentTitle === doc.title;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      dispatch({ type: 'SET_DOCUMENT', payload: { text: doc.text, title: doc.title } });
                      dispatch({ type: 'SET_PERSONA', payload: doc.vertical });
                    }}
                    className={`sample-card${isCurrent ? ' active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                        color: isCurrent ? '#10b981' : '#64748b',
                        background: isCurrent ? 'rgba(16,185,129,0.1)' : 'rgba(51,65,85,0.5)',
                        padding: '0.1rem 0.4rem', borderRadius: '4px',
                      }}>
                        {doc.verticalLabel}
                      </span>
                      <ArrowUpRight size={11} style={{ color: '#334155', flexShrink: 0 }} />
                    </div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {doc.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#475569', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>
                      {doc.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sample-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .sample-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .sample-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  );
}
