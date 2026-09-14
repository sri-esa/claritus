/**
 * Claritus API Key Configuration & Security Disclosure Modal
 */

import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext.jsx';
import { Key, ShieldCheck, Lock, ExternalLink, X, Check } from 'lucide-react';

export default function ApiKeyConfigModal() {
  const { apiKey, isApiKeyModalOpen, dispatch, runAnalysis } = useLegal();
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_API_KEY', payload: inputKey.trim() });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false });
      runAnalysis();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    dispatch({ type: 'SET_API_KEY', payload: '' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-labelledby="api-key-modal-title"
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-fade-in relative"
      >
        <button
          onClick={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false })}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 id="api-key-modal-title" className="text-lg font-bold text-slate-100">
              Configure Google Gemini API Key
            </h3>
            <p className="text-xs text-slate-400">Optional live AI reasoning engine</p>
          </div>
        </div>

        {/* Security Disclosure Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Security & Privacy Assurance
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>In-Memory & Session Storage Only:</strong> Your key is never written to permanent disk storage (`localStorage`) or `.env` files.</li>
            <li><strong>Direct Provider Communication:</strong> Requests are sent directly from your browser to Google Gemini API endpoints without passing through any intermediate proxy servers.</li>
            <li><strong>Zero Storage Guarantee:</strong> Closing your browser tab automatically clears the API key from memory.</li>
          </ul>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-medium text-slate-300 mb-1">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="gemini-key-input"
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono pr-10"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              Get free Gemini key at Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 text-xs font-medium"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors focus:ring-2 focus:ring-emerald-400"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Saved Key!
                </>
              ) : (
                'Save Key & Activate AI'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
