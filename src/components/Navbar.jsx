/**
 * Claritus Header & High-Contrast Tab Navigation Navbar
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
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 font-bold">
              <Scale className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-100 font-heading">
                Claritus
              </h1>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                GenAI Legal Intelligence & Access Platform
              </p>
            </div>
          </div>

          {/* Engine Status & API Key Config Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                isGeminiActive
                  ? 'bg-purple-950/90 text-purple-200 border-purple-600/80 hover:bg-purple-900 shadow-md shadow-purple-950/50'
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-600/80 hover:bg-emerald-900 shadow-md shadow-emerald-950/50'
              }`}
            >
              {isGeminiActive ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                  <span>Gemini AI Active</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Offline Heuristic Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-900" aria-label="Main Navigation">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  isActive
                    ? 'btn-primary shadow-lg shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
