/**
 * Claritus Global Context & State Management
 * React Context + useReducer providing clean, non-prop-drilled state access
 * for documents, analysis results, fallback notices, API keys, and Q&A history.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SYNTHETIC_SAMPLE_DOCS } from '../data/syntheticLegalDocs.js';
import { analyzeDocumentHeuristically, compareDocumentsHeuristically } from '../engine/heuristicLegalEngine.js';
import { analyzeDocumentWithGemini } from '../engine/geminiClient.js';

const LegalContext = createContext();

const SESSION_KEY = "claritus_gemini_api_key";

const initialState = {
  documentText: SYNTHETIC_SAMPLE_DOCS.tenant.text,
  documentTitle: SYNTHETIC_SAMPLE_DOCS.tenant.title,
  comparisonDocText: "",
  comparisonDocTitle: "",
  activePersona: "consumer",
  apiKey: sessionStorage.getItem(SESSION_KEY) || "",
  activeEngine: "auto", // 'auto' (prefers Gemini if key set) | 'heuristic'
  analysisResult: null,
  comparisonResult: null,
  qnaHistory: [],
  activeTab: "simplify", // 'simplify' | 'comparator' | 'risk-radar' | 'qna' | 'brief'
  isAnalyzing: false,
  fallbackAlert: null, // { message, reason, timestamp }
  scannedPdfDetected: false,
  highlightedSectionRef: null,
  isApiKeyModalOpen: false
};

function legalReducer(state, action) {
  switch (action.type) {
    case 'SET_DOCUMENT':
      return {
        ...state,
        documentText: action.payload.text,
        documentTitle: action.payload.title || "Custom Document",
        scannedPdfDetected: false
      };

    case 'SET_COMPARISON_DOCUMENT':
      return {
        ...state,
        comparisonDocText: action.payload.text,
        comparisonDocTitle: action.payload.title || "Comparison Document"
      };

    case 'SET_PERSONA':
      return {
        ...state,
        activePersona: action.payload
      };

    case 'SET_API_KEY':
      if (action.payload) {
        sessionStorage.setItem(SESSION_KEY, action.payload);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
      return {
        ...state,
        apiKey: action.payload
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload
      };

    case 'SET_ANALYZING':
      return {
        ...state,
        isAnalyzing: action.payload
      };

    case 'SET_ANALYSIS_RESULT':
      return {
        ...state,
        analysisResult: action.payload,
        fallbackAlert: action.payload.fallbackTriggered ? {
          message: "Gemini API unavailable — showing offline heuristic analysis",
          reason: action.payload.fallbackReason || "Connection or quota error",
          timestamp: Date.now()
        } : null
      };

    case 'SET_COMPARISON_RESULT':
      return {
        ...state,
        comparisonResult: action.payload
      };

    case 'ADD_QNA_ITEM':
      return {
        ...state,
        qnaHistory: [...state.qnaHistory, action.payload]
      };

    case 'CLEAR_FALLBACK_ALERT':
      return {
        ...state,
        fallbackAlert: null
      };

    case 'SET_SCANNED_PDF':
      return {
        ...state,
        scannedPdfDetected: action.payload
      };

    case 'SET_HIGHLIGHTED_SECTION':
      return {
        ...state,
        highlightedSectionRef: action.payload
      };

    case 'TOGGLE_API_KEY_MODAL':
      return {
        ...state,
        isApiKeyModalOpen: action.payload !== undefined ? action.payload : !state.isApiKeyModalOpen
      };

    default:
      return state;
  }
}

export function LegalProvider({ children }) {
  const [state, dispatch] = useReducer(legalReducer, initialState);

  // Auto-trigger analysis when document, persona, or API key changes
  const runAnalysis = async () => {
    dispatch({ type: 'SET_ANALYZING', value: true });

    let result;
    if (state.apiKey && state.activeEngine === 'auto') {
      result = await analyzeDocumentWithGemini(state.apiKey, state.documentText, state.activePersona);
    } else {
      result = analyzeDocumentHeuristically(state.documentText, state.activePersona);
    }

    if (result.isScannedPdf) {
      dispatch({ type: 'SET_SCANNED_PDF', payload: true });
    }

    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result });

    // Also update comparison if present
    if (state.comparisonDocText) {
      const compResult = compareDocumentsHeuristically(state.documentText, state.comparisonDocText);
      dispatch({ type: 'SET_COMPARISON_RESULT', payload: compResult });
    }

    dispatch({ type: 'SET_ANALYZING', value: false });
  };

  useEffect(() => {
    runAnalysis();
  }, [state.documentText, state.activePersona, state.apiKey]);

  const value = {
    ...state,
    dispatch,
    runAnalysis,
    loadSampleDoc: (key) => {
      const sample = SYNTHETIC_SAMPLE_DOCS[key];
      if (sample) {
        dispatch({ type: 'SET_DOCUMENT', payload: { text: sample.text, title: sample.title } });
        dispatch({ type: 'SET_PERSONA', payload: sample.vertical });
      }
    }
  };

  return <LegalContext.Provider value={value}>{children}</LegalContext.Provider>;
}

export function useLegal() {
  const context = useContext(LegalContext);
  if (!context) {
    throw new Error("useLegal must be used within a LegalProvider");
  }
  return context;
}
