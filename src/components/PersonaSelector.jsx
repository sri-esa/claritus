/**
 * Claritus Persona Lens Selector
 * Tailors risk weightings, Q&A focus, and attorney prep prompts
 * to specific domain sub-lenses within Legal Assistance.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Home, Briefcase, UserCheck, Building2 } from 'lucide-react';

const PERSONAS = [
  { id: 'consumer', label: 'Consumer & Tenant', icon: Home, desc: 'Leases, TOS, Warranties' },
  { id: 'freelancer', label: 'Freelancer & Creator', icon: Briefcase, desc: 'NDAs, Services, IP' },
  { id: 'employee', label: 'Workplace Rights', icon: UserCheck, desc: 'Offers, Non-Competes' },
  { id: 'smb', label: 'Small Business / SMB', icon: Building2, desc: 'B2B SaaS, Vendor Agreements' }
];

export default function PersonaSelector() {
  const { activePersona, dispatch, loadSampleDoc } = useLegal();

  const handleSelect = (personaId) => {
    dispatch({ type: 'SET_PERSONA', payload: personaId });
    loadSampleDoc(personaId === 'consumer' ? 'tenant' : personaId);
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            Domain Persona Sub-Lens
          </h2>
          <p className="text-xs text-slate-400">
            Tailors risk scanning heuristics and attorney prep questions to your specific context.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                isActive
                  ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="font-semibold text-xs text-slate-100">{p.label}</span>
              </div>
              <span className="text-[11px] text-slate-400 line-clamp-1">{p.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
