/**
 * Claritus Header & Tab Navigation Navbar Component
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
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-100 font-heading">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                isGeminiActive
                  ? 'bg-purple-950/80 text-purple-300 border-purple-700/80 hover:bg-purple-900/80'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
              }`}
            >
              {isGeminiActive ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
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
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none" aria-label="Main Navigation">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
