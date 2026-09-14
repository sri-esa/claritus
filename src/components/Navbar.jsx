/**
 * Claritus Header & Tab Navigation Navbar
 * Nav tabs use active bottom-border accent (not filled pill).
 * Engine badge is a muted informational pill.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Scale, FileText, AlertOctagon, GitCompare, MessageSquare, FileCheck, Key, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'simplify', label: 'Document Simplifier', icon: FileText },
  { id: 'risk-radar', label: 'Risk Radar', icon: AlertOctagon },
  { id: 'comparator', label: 'Contract Comparator', icon: GitCompare },
  { id: 'qna', label: 'Legal Copilot Q&A', icon: MessageSquare },
  { id: 'brief', label: 'Attorney Brief', icon: FileCheck }
];

export default function Navbar() {
  const { activeTab, apiKey, analysisResult, dispatch } = useLegal();
  const isGeminiActive = Boolean(apiKey && analysisResult?.engineUsed === 'gemini');

  return (
    <header className="nav-header">
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Top row: logo + engine badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '10px',
              color: '#000',
              display: 'flex',
              boxShadow: '0 2px 10px rgba(16,185,129,0.3)'
            }}>
              <Scale size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                Claritus
              </h1>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: 500 }}>
                GenAI Legal Intelligence &amp; Access Platform
              </p>
            </div>
          </div>

          {/* Engine status badge — muted pill, not a primary action */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true })}
            className={`engine-badge${isGeminiActive ? ' gemini' : ''}`}
            title={isGeminiActive ? 'Gemini AI Active — click to reconfigure' : 'Click to add Gemini API key'}
          >
            {isGeminiActive
              ? <><Sparkles size={11} /><span>Gemini AI</span></>
              : <><Key size={11} /><span>Offline Engine</span></>
            }
          </button>
        </div>

        {/* Tab row — underline-style active tab */}
        <nav
          aria-label="Main Navigation"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.125rem',
            overflowX: 'auto',
            borderTop: '1px solid #1e293b',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-tab${isActive ? ' active' : ''}`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
