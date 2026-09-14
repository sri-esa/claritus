/**
 * Claritus Persona Lens Selector
 * Compact secondary sub-lens controller with high visual distinction for active state.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Home, Briefcase, UserCheck, Building2, Check } from 'lucide-react';

const PERSONAS = [
  { id: 'consumer', label: 'Tenant & Consumer', icon: Home, desc: 'Leases, TOS & Warranties' },
  { id: 'freelancer', label: 'Freelancers & Creators', icon: Briefcase, desc: 'NDAs, MSAs & IP Scope' },
  { id: 'employee', label: 'Workplace Rights', icon: UserCheck, desc: 'Offers & Non-Competes' },
  { id: 'smb', label: 'Small Business / SMB', icon: Building2, desc: 'B2B SaaS & Vendor Terms' }
];

export default function PersonaSelector() {
  const { activePersona, dispatch, loadSampleDoc } = useLegal();

  const handleSelect = (personaId) => {
    dispatch({ type: 'SET_PERSONA', payload: personaId });
    loadSampleDoc(personaId === 'consumer' ? 'tenant' : personaId);
  };

  return (
    <div className="glass-panel-subtle p-3 mb-6 border border-slate-800/80">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Domain Risk Lens
        </span>
        <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
          Adapts risk heuristics to your specific legal scenario
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                isActive
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {isActive ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <span className={`block font-bold text-xs truncate ${isActive ? 'text-emerald-200' : 'text-slate-200'}`}>
                  {p.label}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {p.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
