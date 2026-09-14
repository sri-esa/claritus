/**
 * Claritus Contextual Legal Q&A Copilot
 * - Section header uses section-label + section-title hierarchy
 * - Suggested prompts use .btn-chip (pill, transparent, outline, wrap cleanly)
 * - "Ask Copilot" input uses .input-text (emerald focus ring)
 * - "Ask Copilot" button uses .btn-primary (solid emerald fill)
 * - No logic changes
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { MessageSquare, Send, Sparkles, ExternalLink, Bot, User } from 'lucide-react';
import { answerQuestionWithGemini } from '../engine/geminiClient.js';
import { answerQuestionHeuristically } from '../engine/heuristicLegalEngine.js';

const SUGGESTED_PROMPTS = [
  'What is my financial penalty for early termination?',
  'Who owns the IP and pre-existing code created under this contract?',
  'Is there an automatic lease or contract renewal clause?',
  'What are the notice requirements before entering or modifying terms?'
];

export default function LegalQnACopilot() {
  const { documentText, apiKey, activePersona, qnaHistory, dispatch } = useLegal();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = async (qText) => {
    const targetQ = qText || question;
    if (!targetQ.trim()) return;
    setIsAsking(true);
    let result;
    if (apiKey) {
      result = await answerQuestionWithGemini(apiKey, targetQ, documentText, activePersona);
    } else {
      result = answerQuestionHeuristically(targetQ, documentText, activePersona);
    }
    dispatch({
      type: 'ADD_QNA_ITEM',
      payload: {
        id: Date.now(),
        question: targetQ,
        answer: result.answer,
        citation: result.citation,
        engineUsed: result.engineUsed,
        timestamp: new Date().toLocaleTimeString()
      }
    });
    setQuestion('');
    setIsAsking(false);
  };

  const handleJumpToSection = (sectionRef) => {
    dispatch({ type: 'SET_HIGHLIGHTED_SECTION', payload: sectionRef });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'simplify' });
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>

      {/* Section header */}
      <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b' }}>
        <span className="section-label"><MessageSquare size={11} />Legal Copilot Q&amp;A</span>
        <h3 className="section-title">Interactive Legal Document Copilot</h3>
        <p className="section-desc">Ask targeted questions about clauses, obligations, penalties, or IP terms.</p>
      </div>

      {/* Suggested prompts — pill chips, wrap cleanly */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={11} style={{ color: '#10b981' }} />Suggested Questions
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button key={idx} onClick={() => handleAsk(prompt)} className="btn-chip">
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat transcript */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem', maxHeight: '28rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {qnaHistory.length === 0 ? (
          <div style={{
            padding: '2rem 1rem', textAlign: 'center', borderRadius: '8px',
            border: '1px solid #1e293b', background: '#0b1220',
            fontSize: '0.75rem', color: '#475569'
          }}>
            No questions asked yet. Pick a suggested prompt above or type below.
          </div>
        ) : (
          qnaHistory.map((item) => (
            <div key={item.id} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

              {/* User bubble */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '32rem', padding: '0.625rem 0.875rem',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '12px 12px 2px 12px',
                  fontSize: '0.75rem', color: '#a7f3d0',
                }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.62rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={11} />You
                  </p>
                  {item.question}
                </div>
              </div>

              {/* Bot bubble */}
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.4rem', background: '#253649', borderRadius: '8px', color: '#64748b', flexShrink: 0, marginTop: '0.125rem' }}>
                  <Bot size={14} />
                </div>
                <div style={{
                  flex: 1, maxWidth: '40rem', padding: '0.875rem',
                  background: '#1e293b', border: '1px solid #334155',
                  borderRadius: '2px 12px 12px 12px',
                  fontSize: '0.75rem', color: '#cbd5e1',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
                    <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.7rem' }}>Claritus Copilot</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                        padding: '0.1rem 0.4rem', borderRadius: '4px',
                        background: item.engineUsed === 'gemini' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.08)',
                        color: item.engineUsed === 'gemini' ? '#c4b5fd' : '#6ee7b7',
                        border: `1px solid ${item.engineUsed === 'gemini' ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.2)'}`,
                      }}>
                        {item.engineUsed === 'gemini' ? '✦ Gemini AI' : '⚙ Heuristic'}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: '#334155' }}>{item.timestamp}</span>
                    </div>
                  </div>

                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, color: '#cbd5e1' }}>
                    {item.answer}
                  </div>

                  {item.citation && (
                    <div style={{ marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.65rem', color: '#475569' }}>
                        Cited: <strong style={{ color: '#94a3b8' }}>{item.citation.title}</strong>
                      </span>
                      <button
                        onClick={() => handleJumpToSection(item.citation.sectionRef)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.2rem 0.5rem', borderRadius: '5px',
                          background: 'rgba(16,185,129,0.08)',
                          border: '1px solid rgba(16,185,129,0.25)',
                          color: '#6ee7b7', fontSize: '0.62rem', fontWeight: 600,
                          cursor: 'pointer', transition: 'background 150ms',
                        }}
                      >
                        Jump to {item.citation.sectionRef} <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isAsking && (
          <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem', fontSize: '0.75rem', color: '#475569' }}>
            <Bot size={14} style={{ color: '#10b981' }} />
            Claritus Copilot is analyzing document context…
          </div>
        )}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question about this document…"
          className="input-text"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="btn-primary"
          style={{ flexShrink: 0 }}
        >
          <Send size={14} />
          Ask Copilot
        </button>
      </form>
    </div>
  );
}
