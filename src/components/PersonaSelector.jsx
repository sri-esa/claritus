/**
 * Claritus Persona Lens Selector
 * Secondary sub-panel — recedes visually from primary hero card.
 * Active card: emerald 2px border + emerald-tinted icon + white bold label.
 * Inactive: neutral border + muted icon + slate-300 label.
 */

import React from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Home, Briefcase, UserCheck, Building2, Check } from 'lucide-react';

const PERSONAS = [
  { id: 'consumer',  label: 'Tenant & Consumer',     icon: Home,       desc: 'Leases, TOS & Warranties' },
  { id: 'freelancer',label: 'Freelancers & Creators', icon: Briefcase,  desc: 'NDAs, MSAs & IP Scope' },
  { id: 'employee',  label: 'Workplace Rights',       icon: UserCheck,  desc: 'Offers & Non-Competes' },
  { id: 'smb',       label: 'Small Business / SMB',   icon: Building2,  desc: 'B2B SaaS & Vendor Terms' }
];

export default function PersonaSelector() {
  const { activePersona, dispatch, loadSampleDoc } = useLegal();

  const handleSelect = (personaId) => {
    dispatch({ type: 'SET_PERSONA', payload: personaId });
    loadSampleDoc(personaId === 'consumer' ? 'tenant' : personaId);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Sub-label — clearly smaller and more muted than hero card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
        <span className="section-label">Domain Risk Lens</span>
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>
          Adapts heuristics to your legal context
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
      }} className="persona-grid">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              aria-pressed={isActive}
              className={`persona-card${isActive ? ' active' : ''}`}
            >
              <div className="persona-icon">
                {isActive ? <Check size={14} strokeWidth={3} style={{ color: '#10b981' }} /> : <Icon size={14} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <span className={`persona-label${isActive ? ' active' : ''}`}>{p.label}</span>
                <span className="persona-desc">{p.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .persona-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
