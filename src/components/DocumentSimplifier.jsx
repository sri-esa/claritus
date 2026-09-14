/**
 * Claritus Document Simplifier & Plain English Translator
 * Clause-by-clause breakdown, section citations, and jargon simplification.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Sparkles, FileText, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DocumentSimplifier() {
  const { analysisResult, isAnalyzing, highlightedSectionRef, dispatch } = useLegal();

  if (isAnalyzing) {
    return (
      <div className="glass-panel p-8 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-200">Translating Legal Jargon to Plain English...</p>
      </div>
    );
  }

  if (!analysisResult) return null;

  const { summary, sections, overallScore, engineUsed } = analysisResult;

  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Executive Summary & Plain-English Overview</h3>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${
            engineUsed === 'gemini' 
              ? 'bg-purple-950/80 text-purple-300 border-purple-700/60' 
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
          }`}>
            {engineUsed === 'gemini' ? '✨ Gemini AI Engine' : '⚙️ Heuristic Engine'}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          {summary}
        </p>
      </div>

      {/* Section-by-Section Plain-English Breakdown Table */}
      <div className="glass-panel p-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          Clause-by-Clause Translation Table ({sections.length} Sections)
        </h4>

        <div className="space-y-4">
          {sections.map((sec, idx) => {
            const isHighlighted = highlightedSectionRef === sec.sectionRef;
            return (
              <div
                key={idx}
                id={`sec-anchor-${sec.sectionRef.replace(/[^a-zA-Z0-9]/g, '')}`}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-950 text-emerald-400 rounded border border-slate-800">
                      {sec.sectionRef}
                    </span>
                    <h5 className="text-sm font-bold text-slate-200">{sec.title}</h5>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    sec.severity === 'critical' ? 'bg-red-950 text-red-300 border-red-800' :
                    sec.severity === 'high' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                    sec.severity === 'caution' ? 'bg-yellow-950 text-yellow-300 border-yellow-800' :
                    'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {sec.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800/80">
                  {/* Original Legal Jargon */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Original Legal Text:
                    </span>
                    <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed max-h-36 overflow-y-auto">
                      "{sec.originalText}"
                    </p>
                  </div>

                  {/* Plain English Translation */}
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Plain-English Meaning:
                    </span>
                    <div className="text-xs text-slate-200 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/50 leading-relaxed font-sans font-medium">
                      {sec.plainEnglish}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
