/**
 * Claritus Contextual Legal Q&A Copilot
 * Sanitized text rendering, direct document section citations,
 * instant prompt chips, and fallback-aware engine execution.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { MessageSquare, Send, Sparkles, ExternalLink, Bot, User } from 'lucide-react';
import { answerQuestionWithGemini } from '../engine/geminiClient.js';
import { answerQuestionHeuristically } from '../engine/heuristicLegalEngine.js';

const SUGGESTED_PROMPTS = [
  "What is my financial penalty for early termination?",
  "Who owns the IP and pre-existing code created under this contract?",
  "Is there an automatic lease or contract renewal clause?",
  "What are the notice requirements before entering or modifying terms?"
];

export default function LegalQnACopilot() {
  const { documentText, apiKey, activePersona, qnaHistory, dispatch } = useLegal();
  const [question, setQuestion] = useState("");
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

    setQuestion("");
    setIsAsking(false);
  };

  const handleJumpToSection = (sectionRef) => {
    dispatch({ type: 'SET_HIGHLIGHTED_SECTION', payload: sectionRef });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'simplify' });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Interactive Legal Document Copilot</h3>
            <p className="text-xs text-slate-400">
              Ask targeted questions about your contract clauses, obligations, penalties, or IP terms.
            </p>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Suggested Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(prompt)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-xs rounded-lg text-left transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Q&A Chat Transcript */}
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-1">
          {qnaHistory.length === 0 ? (
            <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-900 text-center text-slate-400 text-xs">
              No questions asked yet. Pick a suggested question above or type a custom prompt below.
            </div>
          ) : (
            qnaHistory.map((item) => (
              <div key={item.id} className="space-y-3 animate-fade-in">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-emerald-950/80 border border-emerald-800/80 p-3 rounded-xl max-w-lg text-xs text-emerald-100">
                    <p className="font-semibold text-[11px] text-emerald-300 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> You:
                    </p>
                    {item.question}
                  </div>
                </div>

                {/* Assistant Answer */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 text-slate-300 rounded-lg shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-2xl text-xs text-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        Claritus Copilot
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          item.engineUsed === 'gemini' 
                            ? 'bg-purple-950 text-purple-300 border-purple-800' 
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}>
                          {item.engineUsed === 'gemini' ? '✨ Gemini AI' : '⚙️ Heuristic'}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      </div>
                    </div>

                    {/* Sanitized Text Answer */}
                    <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-300">
                      {item.answer}
                    </div>

                    {/* Section Citation Anchor Button */}
                    {item.citation && (
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Cited Section: <strong>{item.citation.title}</strong>
                        </span>
                        <button
                          onClick={() => handleJumpToSection(item.citation.sectionRef)}
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-semibold rounded transition-colors"
                        >
                          Jump to {item.citation.sectionRef} <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isAsking && (
            <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse p-4">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Claritus Copilot is analyzing document context...</span>
            </div>
          )}
        </div>

        {/* Question Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question about this document..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="btn-primary px-5 py-2.5 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 focus:ring-2 focus:ring-emerald-400"
          >
            <Send className="w-4 h-4" />
            Ask Copilot
          </button>
        </form>
      </div>
    </div>
  );
}
