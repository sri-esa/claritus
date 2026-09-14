/**
 * Claritus Side-by-Side Contract & Policy Comparator
 * Highlights added obligations, deleted protections, and altered risk scores.
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { GitCompare, PlusCircle, MinusCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { compareDocumentsHeuristically } from '../engine/heuristicLegalEngine.js';

export default function ContractComparator() {
  const { documentText, comparisonDocText, comparisonResult, dispatch } = useLegal();
  const [compInput, setCompInput] = useState(comparisonDocText);
  const [isEditingComp, setIsEditingComp] = useState(!comparisonDocText);

  const handleApplyComparison = () => {
    if (!compInput.trim()) return;
    dispatch({
      type: 'SET_COMPARISON_DOCUMENT',
      payload: { text: compInput, title: "Comparison Agreement (Version B)" }
    });

    const compRes = compareDocumentsHeuristically(documentText, compInput);
    dispatch({ type: 'SET_COMPARISON_RESULT', payload: compRes });
    setIsEditingComp(false);
  };

  return (
    <div className="space-y-6">
      {/* Comparator Control Box */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Side-by-Side Contract & Policy Comparator</h3>
              <p className="text-xs text-slate-400">
                Compare baseline contract (Document A) against client-edited or updated agreement (Document B).
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingComp(!isEditingComp)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            {isEditingComp ? 'Hide Input Box' : 'Edit / Change Document B'}
          </button>
        </div>

        {isEditingComp && (
          <div className="space-y-3 mb-6 animate-fade-in">
            <label className="block text-xs font-semibold text-slate-300">
              Document B Text (Modified or Second Agreement):
            </label>
            <textarea
              value={compInput}
              onChange={(e) => setCompInput(e.target.value)}
              rows={8}
              placeholder="Paste second contract or modified agreement text here to analyze diffs..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleApplyComparison}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Run Side-by-Side Comparison
              </button>
            </div>
          </div>
        )}

        {/* Comparison Metrics Header */}
        {comparisonResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Safety Score Shift</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-extrabold ${comparisonResult.scoreShift >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparisonResult.scoreShift >= 0 ? `+${comparisonResult.scoreShift}` : comparisonResult.scoreShift} pts
                </span>
                <span className="text-xs text-slate-400">
                  (Doc B: {comparisonResult.scoreB} vs Doc A: {comparisonResult.scoreA})
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">New Clauses Added</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">
                {comparisonResult.newObligationsCount} clause(s)
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Risk Severity Shifts</span>
              <div className="text-2xl font-extrabold text-orange-400 mt-1">
                {comparisonResult.alteredRisksCount} clause(s)
              </div>
            </div>
          </div>
        )}

        {/* Comparison Diff Table */}
        {comparisonResult ? (
          <div className="space-y-4">
            {comparisonResult.comparisonRows.map((row) => (
              <div
                key={row.index}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {row.sectionRef}
                  </span>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    row.status === 'added' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    row.status === 'removed' ? 'bg-red-950 text-red-300 border-red-800' :
                    row.status === 'modified' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                    'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {row.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Document A (Original Baseline):
                    </span>
                    <p className="text-xs font-mono text-slate-300">
                      {row.docA ? row.docA.originalText : <em className="text-slate-500">[Section not present in Document A]</em>}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Document B (Comparison Version):
                    </span>
                    <p className="text-xs font-mono text-slate-300">
                      {row.docB ? row.docB.originalText : <em className="text-slate-500">[Section deleted in Document B]</em>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Paste Document B text above to compute instant side-by-side contract diffs.
          </div>
        )}
      </div>
    </div>
  );
}
