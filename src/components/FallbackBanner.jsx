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
      className="fallback-banner animate-fade-in"
      style={{
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.75rem', color: '#fde68a' }}>
              {fallbackAlert.message}
            </p>
            <p style={{ margin: '0.125rem 0 0', fontSize: '0.65rem', color: '#92400e', fontFamily: 'var(--font-mono)' }}>
              Reason: {fallbackAlert.reason}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <button
            onClick={runAnalysis}
            className="btn-secondary"
            style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem' }}
            title="Retry Gemini API request"
          >
            <RefreshCw size={11} />Retry
          </button>
          <button
            onClick={() => dispatch({ type: 'CLEAR_FALLBACK_ALERT' })}
            style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#78350f' }}
            aria-label="Dismiss warning"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
