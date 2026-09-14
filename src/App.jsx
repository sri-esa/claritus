/**
 * Claritus Main Application Component
 */

import React from 'react';
import { LegalProvider, useLegal } from './context/LegalContext.jsx';
import Navbar from './components/Navbar.jsx';
import PersonaSelector from './components/PersonaSelector.jsx';
import DocumentUploader from './components/DocumentUploader.jsx';
import FallbackBanner from './components/FallbackBanner.jsx';
import ScannedPdfAlertModal from './components/ScannedPdfAlertModal.jsx';
import ApiKeyConfigModal from './components/ApiKeyConfigModal.jsx';
import DocumentSimplifier from './components/DocumentSimplifier.jsx';
import RiskRadar from './components/RiskRadar.jsx';
import ContractComparator from './components/ContractComparator.jsx';
import LegalQnACopilot from './components/LegalQnACopilot.jsx';
import AttorneyBriefModal from './components/AttorneyBriefModal.jsx';
import { Scale, ShieldAlert } from 'lucide-react';

function MainContent() {
  const { activeTab } = useLegal();

  return (
    <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Fallback Banner Alert */}
      <FallbackBanner />

      {/* Domain Persona Selector — secondary, recedes visually */}
      <PersonaSelector />

      {/* Document Uploader — primary focal hero card */}
      <DocumentUploader />

      {/* Main Feature Workspace */}
      <section style={{ marginTop: '0.5rem' }} aria-label="Feature Workspace">
        {activeTab === 'simplify' && <DocumentSimplifier />}
        {activeTab === 'risk-radar' && <RiskRadar />}
        {activeTab === 'comparator' && <ContractComparator />}
        {activeTab === 'qna' && <LegalQnACopilot />}
        {activeTab === 'brief' && <AttorneyBriefModal />}
      </section>

      {/* Disclaimer footer — very muted */}
      <footer style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <ShieldAlert size={13} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Informational Legal Intelligence Notice</span>
        </div>
        <p style={{ margin: '0 auto 0.5rem', maxWidth: '44rem', fontSize: '0.7rem', color: '#334155', lineHeight: 1.6 }}>
          Claritus is a decision-support platform to help users understand and prepare legal information. It does not provide binding legal advice or replace professional legal counsel.
        </p>
        <p style={{ margin: 0, fontSize: '0.62rem', color: '#1e293b' }}>
          © {new Date().getFullYear()} Claritus Platform
        </p>
      </footer>

      {/* Modals */}
      <ScannedPdfAlertModal />
      <ApiKeyConfigModal />
    </main>
  );
}

export default function App() {
  return (
    <LegalProvider>
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#cbd5e1', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
        <Navbar />
        <MainContent />
      </div>
    </LegalProvider>
  );
}
