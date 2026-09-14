# Claritus | GenAI-Powered Legal Intelligence & Access Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Framework: React 18](https://img.shields.io/badge/Framework-React%2018-blue.svg)](https://react.dev/)
[![Engine: Gemini AI + Heuristic](https://img.shields.io/badge/Engine-Gemini%20AI%20%2B%20Heuristic-purple.svg)](https://deepmind.google/technologies/gemini/)

**Claritus** is an accessible decision-support platform built for the **AI for Legal Assistance & Access** challenge track. It bridges the gap between complex legal legalese and plain-English understanding for consumers, tenants, freelancers, employees, and small business owners.

> [!NOTE]
> Claritus provides educational analysis and assistance to help users prepare for legal transactions, without replacing professional legal advice.

---

## 🎯 Chosen Vertical & Persona Sub-Lenses

Claritus focuses on **AI for Legal Assistance & Access**. To provide domain-specific context without diluting the core challenge vertical, Claritus incorporates four tailored domain sub-lenses:

1. **Consumer & Tenant Protection**: Leases, Terms of Service, EULAs, warranties, rent escalation.
2. **Freelancer & Creator Defense**: NDAs, Master Service Agreements (MSAs), IP transfers, Net-90 delays.
3. **Employment & Workplace Rights**: Offer letters, non-competes, invention assignment, severance terms.
4. **Small Business & SMB Operations**: B2B SaaS agreements, vendor contracts, SLA guarantees, price increases.

---

## ⚡ Key Features

- 📄 **Document Simplifier & Plain English Breakdown**: Parses documents clause-by-clause, producing executive summaries, plain-English translations, and section citations (`[§1.0]`).
- ⚠️ **Accessible Risk & Ambiguity Radar**: Scans for high-risk clauses (unlimited indemnification, forced arbitration, auto-renewal traps, IP forfeit) with WCAG AA compliance.
- ⚔️ **Side-by-Side Contract & Policy Comparator**: Compares baseline contracts against modified versions, calculating safety score shifts (+/- pts) and highlighting added obligations.
- 💬 **Interactive Legal Copilot Q&A**: Context-aware Q&A assistant with suggested prompt chips and section citations.
- 📋 **Attorney Consultation Brief & Playbook**: Generates a prep sheet and negotiation checklist to save billable hours with legal counsel.

---

## 🧠 Architectural Design & Logical Fallback Flow

### Intelligent Dual-Engine Architecture
Claritus operates with a dual-engine workflow:

```
[ User Action: Analyze / Compare / Ask Q&A ]
                     │
         Is Gemini API Key Configured?
           ┌─────────┴─────────┐
          NO                  YES
           │                   │
           ▼                   ▼
    Use Heuristic       Try Gemini API Call
   Engine Directly    (15s AbortController Timeout)
           │                   │
           │           ┌───────┴───────┐
           │        SUCCESS         FAILURE (401, 429, Timeout, Network Error)
           │           │               │
           │           ▼               ▼
           │       Render AI     Auto-Fallback to Heuristic Engine
           │        Result       + Render Visible Alert Banner
           │       + Badge       "Gemini unavailable ([reason])"
           │       "Gemini AI"   + Retry Request Button
           ▼           ▼               ▼
        Result Always Renders — Never Blank/Broken
```

### 🔒 API Key Security Tradeoffs & Disclosures
- **Client-Side Pure Architecture**: Claritus operates entirely in the user's browser without intermediate proxy servers.
- **In-Memory & `sessionStorage` Retention**: API keys are stored only in React memory and `sessionStorage` (cleared when the browser tab closes).
- **Zero Storage Commitment**: API keys are **never** written to permanent `localStorage` or `.env` files.
- **Direct Provider Request**: Network calls are dispatched directly to `https://generativelanguage.googleapis.com`.

---

## ♿ WCAG AA Accessibility & Design Aesthetics

- **Tri-Token Severity Tags**: Every risk indicator pairs an **Explicit Icon Shape** + **Contrast-Compliant Color** + **Readable Text Label**:
  - `[🛑 CRITICAL RISK]` (AlertOctagon icon + high-contrast red badge)
  - `[⚠️ HIGH RISK]` (AlertTriangle icon + high-contrast orange badge)
  - `[⚡ CAUTION]` (AlertCircle icon + high-contrast yellow badge)
  - `[✅ STANDARD]` (CheckCircle icon + high-contrast green badge)
- **Screen Reader Text Equivalent**: SVG Radar charts include a parallel text summary (`aria-describedby`) announcing exact risk counts.
- **Keyboard Navigation**: All risk chips are keyboard focusable and expandable (`Enter` / `Space`).
- **Scanned Image PDF Detection**: Detects PDFs lacking digital text (<10 words) and presents a non-OCR user guidance modal.

---

## 🚀 Setup & Local Execution

### Prerequisites
- Node.js (v18+ recommended)
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/claritus.git
cd claritus

# Install dependencies
npm install

# Run dev server
npm run dev
```

### Running Automated Test Suite
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack & Repository Hygiene

- **Frontend**: React 18, Vite, Lucide Icons, Tailwind CSS / Custom Glassmorphism CSS.
- **Testing**: Vitest + JSDOM.
- **Repository Constraints Compliance**:
  - Committed footprint strictly **< 10 MB** (node_modules and dist gitignored).
  - Single `main` git branch workflow.
  - Zero third-party runtime binaries.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
