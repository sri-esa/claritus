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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Fallback Banner Alert */}
      <FallbackBanner />

      {/* Domain Persona Selector */}
      <PersonaSelector />

      {/* Document Reader / Uploader */}
      <DocumentUploader />

      {/* Main Feature Active Tab Content */}
      <section className="mt-6" aria-label="Feature Workspace">
        {activeTab === 'simplify' && <DocumentSimplifier />}
        {activeTab === 'risk-radar' && <RiskRadar />}
        {activeTab === 'comparator' && <ContractComparator />}
        {activeTab === 'qna' && <LegalQnACopilot />}
        {activeTab === 'brief' && <AttorneyBriefModal />}
      </section>

      {/* Educational Disclaimer Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Informational Legal Intelligence & Access Notice</span>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Claritus is a generative AI decision-support platform designed to help users understand, compare, and prepare legal information. Claritus does not provide binding legal advice or replace professional legal counsel. For critical legal transactions, always consult a licensed attorney.
        </p>
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Claritus Platform • AI for Legal Assistance & Access
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <MainContent />
      </div>
    </LegalProvider>
  );
}
