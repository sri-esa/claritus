/**
 * Claritus Attorney Consultation Brief & Negotiation Checklist Generator
 * Formats printable/exportable legal brief to save billable hours with legal counsel.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { FileCheck, Download, Copy, Check, Printer, ShieldAlert, Sparkles } from 'lucide-react';

export default function AttorneyBriefModal() {
  const { analysisResult, documentTitle, activePersona } = useLegal();
  const [copied, setCopied] = useState(false);

  if (!analysisResult) return null;

  const { riskItems, riskCounts, overallScore, engineUsed, summary } = analysisResult;

  const generateMarkdownBrief = () => {
    return `# CLARITUS ATTORNEY CONSULTATION BRIEF & NEGOTIATION PLAYBOOK
Document Title: ${documentTitle}
Domain Sub-Lens: ${activePersona.toUpperCase()}
Generated: ${new Date().toLocaleDateString()}
Engine Analysis Engine: ${engineUsed === 'gemini' ? 'Google Gemini AI' : 'Claritus Offline Heuristic Engine'}
Safety Rating: ${overallScore}/100

---

## 1. EXECUTIVE SUMMARY & RISK PROFILE
${summary}

Total Flagged Clauses: ${riskItems.length}
- Critical Risk: ${riskCounts.critical}
- High Warning: ${riskCounts.high}
- Caution: ${riskCounts.caution}
- Standard Clauses: ${riskCounts.standard}

---

## 2. PRIORITIZED NEGOTIATION CHECKLIST (PRE-SIGNING)
${riskItems.map((item, i) => `
${i + 1}. [${item.label.toUpperCase()}] ${item.sectionRef} ${item.sectionTitle || item.category}
   - Concern: ${item.explanation}
   - Target Change: ${item.suggestedLanguage}
`).join('')}

---

## 3. POINTED QUESTIONS FOR LEGAL COUNSEL (TO MINIMIZE BILLABLE HOURS)
1. "Given the indemnification clause in ${riskItems.find(r => r.severity === 'critical')?.sectionRef || '[§1.0]'}, what maximum financial liability cap should we insist on?"
2. "How enforceable is the non-compete / non-solicitation timeframe specified under current regional case law?"
3. "What specific formal written notice format is required to ensure the automatic renewal clause does not trigger?"

---
*Notice: Claritus provides informational analysis to assist consultation with licensed legal professionals.*`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownBrief());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Attorney Consultation Brief & Negotiation Checklist</h3>
              <p className="text-xs text-slate-400">
                Actionable prep sheet designed to structure your consultation with a legal professional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Brief' : 'Copy Brief (MD)'}
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Brief Content Preview Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6 text-slate-200">
          {/* Brief Header Meta */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-900">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Document</span>
              <h4 className="text-sm font-bold text-emerald-400">{documentTitle}</h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Engine Tag</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block mt-0.5 ${
                engineUsed === 'gemini' 
                  ? 'bg-purple-950 text-purple-300 border-purple-800' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {engineUsed === 'gemini' ? '✨ Gemini AI Engine' : '⚙️ Heuristic Engine'}
              </span>
            </div>
          </div>

          {/* Section 1: Pre-Signing Checklist */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> 1. Pre-Signing Negotiation Checklist
            </h4>
            <div className="space-y-2">
              {riskItems.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{idx + 1}.</span>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 mr-2">
                      [{item.label}] {item.sectionRef} {item.sectionTitle || item.category}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      <strong>Concern:</strong> {item.explanation}
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-1 font-mono bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                      <strong>Counter Proposal:</strong> {item.suggestedLanguage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Attorney Question Sheet */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 2. Target Questions for Legal Consultation
            </h4>
            <ul className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>"Given the indemnification clause, what maximum financial liability cap should we insist on before signing?"</li>
              <li>"How enforceable is the non-compete and non-solicitation timeframe under current regional case law?"</li>
              <li>"What specific formal written notice format is required to ensure the automatic renewal clause does not trigger?"</li>
              <li>"Are pre-existing IP tools and software libraries adequately carved out from full client assignment?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
