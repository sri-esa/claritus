/**
 * Claritus Accessible Risk Radar & Ambiguity Matrix Component
 * Compliant with WCAG AA accessibility rules, dual shape+text severity tags,
 * screen-reader SVG summaries, and keyboard-focusable expandable risk cards.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical Risk",
    icon: AlertOctagon,
    badgeClasses: "bg-red-950/90 text-red-200 border-red-700/80 hover:bg-red-900/90",
    bgCard: "bg-red-950/30 border-red-900/50",
    meterColor: "#ef4444"
  },
  high: {
    label: "High Risk",
    icon: AlertTriangle,
    badgeClasses: "bg-orange-950/90 text-orange-200 border-orange-700/80 hover:bg-orange-900/90",
    bgCard: "bg-orange-950/30 border-orange-900/50",
    meterColor: "#f97316"
  },
  caution: {
    label: "Caution",
    icon: AlertCircle,
    badgeClasses: "bg-yellow-950/90 text-yellow-200 border-yellow-700/80 hover:bg-yellow-900/90",
    bgCard: "bg-yellow-950/30 border-yellow-900/50",
    meterColor: "#eab308"
  },
  standard: {
    label: "Standard",
    icon: CheckCircle,
    badgeClasses: "bg-emerald-950/90 text-emerald-200 border-emerald-700/80 hover:bg-emerald-900/90",
    bgCard: "bg-emerald-950/30 border-emerald-900/50",
    meterColor: "#10b981"
  }
};

export default function RiskRadar() {
  const { analysisResult, isAnalyzing, dispatch } = useLegal();
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [copiedCounterId, setCopiedCounterId] = useState(null);

  if (isAnalyzing) {
    return (
      <div className="glass-panel p-8 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-200">Scanning Document Clauses & Calculating Risk Radar...</p>
      </div>
    );
  }

  if (!analysisResult) return null;

  const { riskItems, riskCounts, overallScore, engineUsed } = analysisResult;

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand(id);
    }
  };

  const copyLanguage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCounterId(id);
    setTimeout(() => setCopiedCounterId(null), 1500);
  };

  const summaryText = `${riskCounts.critical} critical risk, ${riskCounts.high} high risk, ${riskCounts.caution} caution, and ${riskCounts.standard} standard clauses identified. Overall contract safety rating is ${overallScore} out of 100.`;

  return (
    <div className="space-y-6">
      {/* Header & Risk Score Visualizer */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Risk Meter Visualizer */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              {/* Accessible SVG Radar Meter */}
              <svg 
                className="w-full h-full transform -rotate-90" 
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  stroke={overallScore > 75 ? '#10b981' : overallScore > 50 ? '#f59e0b' : '#ef4444'}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-100">{overallScore}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-100">Clause Risk & Ambiguity Radar</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  engineUsed === 'gemini' 
                    ? 'bg-purple-950/80 text-purple-300 border-purple-700/60' 
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                }`}>
                  {engineUsed === 'gemini' ? '✨ Gemini AI' : '⚙️ Heuristic Engine'}
                </span>
              </div>
              
              {/* Screen Reader Text Equivalent Summary */}
              <p id="risk-radar-sr-summary" className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {summaryText}
              </p>
            </div>
          </div>

          {/* Tri-Token Accessible Severity Chips Count Bar */}
          <div 
            aria-describedby="risk-radar-sr-summary"
            className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0"
          >
            {Object.entries(riskCounts).map(([sevKey, count]) => {
              const conf = SEVERITY_CONFIG[sevKey];
              const Icon = conf.icon;
              return (
                <div key={sevKey} className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${conf.badgeClasses}`}>
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{conf.label}:</span>
                    <span className="font-extrabold">{count}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Items List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          Flagged Clauses & Negotiation Playbook ({riskItems.length})
        </h4>

        {riskItems.length === 0 ? (
          <div className="glass-panel p-6 text-center text-slate-400 text-xs">
            No critical risk patterns detected in this document.
          </div>
        ) : (
          riskItems.map((item) => {
            const conf = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.caution;
            const Icon = conf.icon;
            const isExpanded = expandedCardId === item.id;

            return (
              <div
                key={item.id}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`${conf.label}: section ${item.sectionRef} ${item.sectionTitle || item.category}`}
                onClick={() => toggleExpand(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`glass-panel border p-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${conf.bgCard}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Tri-Token Severity Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border shrink-0 ${conf.badgeClasses}`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span>{conf.label}</span>
                    </span>

                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 mr-2">
                        {item.sectionRef}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {item.sectionTitle || item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 shrink-0">
                    <span className="text-[11px] hidden sm:inline text-slate-400">
                      {isExpanded ? 'Click to collapse' : 'Click to view playbook'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Always-visible brief explanation snippet */}
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {item.explanation}
                </p>

                {/* Expandable Playbook details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-fade-in">
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Original Document Clause:
                      </h5>
                      <blockquote className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono italic leading-relaxed">
                        "{item.clauseText}"
                      </blockquote>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          Suggested Counter-Negotiation Language:
                        </h5>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLanguage(item.id, item.suggestedLanguage);
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded transition-colors"
                        >
                          {copiedCounterId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedCounterId === item.id ? 'Copied' : 'Copy Language'}
                        </button>
                      </div>
                      <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50 text-xs text-emerald-200 leading-relaxed font-mono">
                        {item.suggestedLanguage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
