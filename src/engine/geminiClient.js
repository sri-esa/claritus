/**
 * Claritus Gemini API Client with Smart Fallback Engine Integration
 * Implements 15s timeout via AbortController, specific error categorization,
 * and automatic fallback to built-in Heuristic Engine with UI notifications.
 */

import { analyzeDocumentHeuristically, compareDocumentsHeuristically, answerQuestionHeuristically } from './heuristicLegalEngine.js';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const TIMEOUT_MS = 15000; // 15 seconds strict timeout

/**
 * Helper to execute Gemini fetch with AbortController timeout
 */
async function fetchWithTimeout(url, options, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error("REQUEST_TIMEOUT");
    }
    throw err;
  }
}

/**
 * Parse Gemini API error responses
 */
function parseGeminiError(err, status) {
  if (err.message === "REQUEST_TIMEOUT") {
    return "Request timed out (15s limit reached)";
  }
  if (status === 401 || status === 403) {
    return "Invalid or unauthorized Gemini API key (401/403)";
  }
  if (status === 429) {
    return "Gemini API rate limit exceeded / quota reached (429)";
  }
  if (err.message && err.message.includes("Failed to fetch")) {
    return "Network error or connection blocked";
  }
  return err.message || `API HTTP error (${status})`;
}

/**
 * Execute Gemini Analysis with auto-fallback
 */
export async function analyzeDocumentWithGemini(apiKey, rawText, persona = 'consumer') {
  if (!apiKey) {
    const fallbackResult = analyzeDocumentHeuristically(rawText, persona);
    return {
      ...fallbackResult,
      engineUsed: 'heuristic',
      fallbackTriggered: false,
      fallbackReason: null
    };
  }

  const prompt = `You are Claritus Legal AI. Analyze the following legal text for a user with the persona focus "${persona}".
  Return ONLY valid JSON matching this schema:
  {
    "summary": "Plain English overall document summary",
    "overallScore": 85,
    "riskCounts": { "critical": 0, "high": 1, "caution": 2, "standard": 5 },
    "riskItems": [
      {
        "id": "risk-1",
        "sectionRef": "[§2.0]",
        "sectionTitle": "Section Title",
        "clauseText": "Exact text quote",
        "severity": "critical|high|caution|standard",
        "label": "Critical Risk|High Risk|Caution|Standard",
        "iconName": "AlertOctagon|AlertTriangle|AlertCircle|CheckCircle",
        "category": "Category",
        "explanation": "Why this is dangerous",
        "suggestedLanguage": "Better counter-proposal wording"
      }
    ],
    "sections": [
      {
        "sectionRef": "[§1.0]",
        "title": "Title",
        "originalText": "Quote",
        "plainEnglish": "Plain explanation",
        "severity": "standard|caution|high|critical"
      }
    ]
  }

  Document Text:
  """
  ${rawText.substring(0, 15000)}
  """`;

  try {
    const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      throw new Error("MALFORMED_RESPONSE");
    }

    const parsed = JSON.parse(jsonText);
    return {
      ...parsed,
      engineUsed: 'gemini',
      fallbackTriggered: false,
      fallbackReason: null
    };

  } catch (err) {
    const statusMatch = err.message.match(/HTTP_(\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : null;
    const reason = parseGeminiError(err, status);

    // Fall back to Heuristic Engine
    const fallbackResult = analyzeDocumentHeuristically(rawText, persona);
    return {
      ...fallbackResult,
      engineUsed: 'heuristic',
      fallbackTriggered: true,
      fallbackReason: reason
    };
  }
}

/**
 * Answer Document Q&A via Gemini with fallback
 */
export async function answerQuestionWithGemini(apiKey, question, rawText, persona = 'consumer') {
  if (!apiKey) {
    return answerQuestionHeuristically(question, rawText, persona);
  }

  const prompt = `You are Claritus Legal AI. Answer this user question based ONLY on the provided legal text.
  Question: "${question}"
  Return ONLY valid JSON:
  {
    "answer": "Clear, plain English answer citing section numbers",
    "citation": { "sectionRef": "[§X.Y]", "title": "Section Title" }
  }

  Legal Document:
  """
  ${rawText.substring(0, 15000)}
  """`;

  try {
    const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const data = await response.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("MALFORMED_RESPONSE");

    const parsed = JSON.parse(jsonText);
    return {
      ...parsed,
      engineUsed: 'gemini',
      fallbackTriggered: false
    };

  } catch (err) {
    const fallback = answerQuestionHeuristically(question, rawText, persona);
    return {
      ...fallback,
      engineUsed: 'heuristic',
      fallbackTriggered: true,
      fallbackReason: err.message
    };
  }
}
