/**
 * Claritus Built-in Heuristic Legal AI Engine
 * Offline deterministic engine for clause simplification, risk scanning,
 * side-by-side contract comparison, Q&A copilot, and attorney brief generation.
 */

import { RISK_PATTERNS } from '../data/riskPatterns.js';
import { chunkDocumentText } from './sectionChunker.js';

// Cache store for heuristic analysis results per document text hash
const heuristicCache = new Map();

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export function analyzeDocumentHeuristically(rawText, persona = 'consumer') {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      isEmpty: true,
      engineUsed: 'heuristic',
      summary: "No document content provided.",
      riskItems: [],
      sections: [],
      riskCounts: { critical: 0, high: 0, caution: 0, standard: 0 },
      overallScore: 100,
      persona
    };
  }

  const cacheKey = hashString(rawText + '_' + persona);
  if (heuristicCache.has(cacheKey)) {
    return heuristicCache.get(cacheKey);
  }

  const chunkResult = chunkDocumentText(rawText);
  if (chunkResult.isScannedPdf) {
    const result = {
      isScannedPdf: true,
      engineUsed: 'heuristic',
      summary: "Scanned image PDF detected with no extractable text.",
      riskItems: [],
      sections: [],
      riskCounts: { critical: 0, high: 0, caution: 0, standard: 0 },
      overallScore: 0,
      persona
    };
    heuristicCache.set(cacheKey, result);
    return result;
  }

  const sections = chunkResult.sections;
  const riskItems = [];
  const simplifiedSections = [];

  const riskCounts = { critical: 0, high: 0, caution: 0, standard: 0 };

  sections.forEach((sec, idx) => {
    let sectionMaxSeverity = 'standard';
    let matchedPattern = null;

    for (const pattern of RISK_PATTERNS) {
      if (pattern.regex.test(sec.content)) {
        matchedPattern = pattern;
        sectionMaxSeverity = pattern.severity;
        break;
      }
    }

    if (matchedPattern) {
      riskCounts[matchedPattern.severity]++;
      riskItems.push({
        id: `risk-${idx + 1}-${matchedPattern.patternId}`,
        sectionRef: sec.sectionRef,
        sectionTitle: sec.title,
        clauseText: sec.content.trim(),
        severity: matchedPattern.severity,
        label: matchedPattern.label,
        iconName: matchedPattern.iconName,
        category: matchedPattern.category,
        explanation: matchedPattern.explanation,
        suggestedLanguage: matchedPattern.suggestedLanguage
      });
    } else {
      riskCounts.standard++;
    }

    // Generate Plain English breakdown
    simplifiedSections.push({
      sectionRef: sec.sectionRef,
      title: sec.title,
      originalText: sec.content.trim(),
      plainEnglish: generatePlainEnglish(sec.title, sec.content),
      severity: sectionMaxSeverity
    });
  });

  // Calculate Overall Safety Score (100 down to 0)
  const scoreDeductions = (riskCounts.critical * 25) + (riskCounts.high * 12) + (riskCounts.caution * 5);
  const overallScore = Math.max(0, 100 - scoreDeductions);

  const result = {
    isEmpty: false,
    isScannedPdf: false,
    engineUsed: 'heuristic',
    summary: generateExecutiveSummary(sections.length, riskCounts, overallScore, persona),
    sections: simplifiedSections,
    riskItems,
    riskCounts,
    overallScore,
    totalWords: chunkResult.totalWords,
    totalLines: chunkResult.totalLines,
    persona
  };

  heuristicCache.set(cacheKey, result);
  return result;
}

function generatePlainEnglish(title, content) {
  if (/rent|fee|payment|salary|pricing/i.test(content)) {
    return "Financial Obligation: Details payment amounts, due dates, penalties, and fee adjustments.";
  }
  if (/indemnify|liability|damage|hold harmless/i.test(content)) {
    return "Legal Protection / Risk Shift: Specifies who pays for legal losses, damages, or lawsuit costs.";
  }
  if (/arbitration|dispute|jury|court/i.test(content)) {
    return "Dispute Resolution: Sets rules on how disagreements are handled (e.g. mandatory private arbitration vs court).";
  }
  if (/renew|term|expiration|cancel/i.test(content)) {
    return "Contract Duration & Extension: Outlines contract start/end dates and cancellation notice requirements.";
  }
  if (/invention|intellectual property|copyright|code|deliverable/i.test(content)) {
    return "Intellectual Property Ownership: Controls who owns the work, designs, code, or ideas created under this agreement.";
  }
  if (/compete|solicit|industry|region/i.test(content)) {
    return "Work Restriction: Limits your freedom to work for competitors or operate in similar business areas.";
  }
  return "General Terms: Standard contractual guidelines outlining operational duties and conditions.";
}

function generateExecutiveSummary(totalSections, riskCounts, score, persona) {
  let assessment = "balanced with manageable risks";
  if (score < 50) assessment = "HIGH RISK requiring significant negotiation and caution before signing";
  else if (score < 80) assessment = "MODERATE RISK with key clauses requiring amendment";

  return `Document analysis across ${totalSections} sections reveals an overall safety rating of ${score}/100. This agreement is assessed as ${assessment}. Flagged items include ${riskCounts.critical} critical alert(s), ${riskCounts.high} high warning(s), and ${riskCounts.caution} moderate caution(s).`;
}

/**
 * Compare two legal documents side-by-side
 */
export function compareDocumentsHeuristically(docA, docB) {
  const analysisA = analyzeDocumentHeuristically(docA);
  const analysisB = analyzeDocumentHeuristically(docB);

  const sectionsA = analysisA.sections;
  const sectionsB = analysisB.sections;

  const comparisonRows = [];
  const maxLen = Math.max(sectionsA.length, sectionsB.length);

  let newObligationsCount = 0;
  let alteredRisksCount = 0;

  for (let i = 0; i < maxLen; i++) {
    const secA = sectionsA[i] || null;
    const secB = sectionsB[i] || null;

    let status = 'identical';
    if (!secA && secB) {
      status = 'added';
      newObligationsCount++;
    } else if (secA && !secB) {
      status = 'removed';
    } else if (secA && secB) {
      if (secA.originalText !== secB.originalText) {
        status = 'modified';
        if (secB.severity !== secA.severity) {
          alteredRisksCount++;
        }
      }
    }

    comparisonRows.push({
      index: i + 1,
      sectionRef: secB?.sectionRef || secA?.sectionRef || `[§${i + 1}.0]`,
      docA: secA,
      docB: secB,
      status
    });
  }

  const scoreShift = analysisB.overallScore - analysisA.overallScore;

  return {
    engineUsed: 'heuristic',
    scoreA: analysisA.overallScore,
    scoreB: analysisB.overallScore,
    scoreShift,
    newObligationsCount,
    alteredRisksCount,
    comparisonRows,
    summary: `Side-by-side comparison shows a safety score shift of ${scoreShift >= 0 ? '+' : ''}${scoreShift} points (Document B score: ${analysisB.overallScore}/100 vs Document A: ${analysisA.overallScore}/100). Found ${newObligationsCount} new clause(s) added and ${alteredRisksCount} risk level shift(s).`
  };
}

/**
 * Heuristic Contextual Legal Q&A Copilot
 */
export function answerQuestionHeuristically(question, rawText, persona) {
  const analysis = analyzeDocumentHeuristically(rawText, persona);
  const qLower = question.toLowerCase();

  let matchedSection = null;
  let answer = "";

  if (/cost|pay|fee|rent|money|financial|penalty/i.test(qLower)) {
    matchedSection = analysis.sections.find(s => /rent|fee|payment|salary|pricing|penalty/i.test(s.originalText));
    answer = matchedSection 
      ? `Regarding financial obligations, Section ${matchedSection.sectionRef} (${matchedSection.title}) states:\n\n"${matchedSection.originalText.substring(0, 200)}..."\n\nKey Takeaway: Carefully check exact payment due dates and automatic late fee triggers.`
      : "No explicit financial fee terms were identified in the scanned document sections.";
  } else if (/terminate|cancel|leave|exit|break/i.test(qLower)) {
    matchedSection = analysis.sections.find(s => /renew|term|expiration|cancel|terminate/i.test(s.originalText));
    answer = matchedSection
      ? `Regarding contract termination and cancellation, Section ${matchedSection.sectionRef} (${matchedSection.title}) states:\n\n"${matchedSection.originalText.substring(0, 200)}..."\n\nKey Takeaway: Watch out for advance written notice deadlines (e.g., 90–120 days) required to prevent auto-renewal.`
      : "No explicit early termination terms were identified in the scanned document sections.";
  } else if (/ip|intellectual property|code|work|design|owner/i.test(qLower)) {
    matchedSection = analysis.sections.find(s => /invention|intellectual property|copyright|code|deliverable/i.test(s.originalText));
    answer = matchedSection
      ? `Regarding Intellectual Property rights, Section ${matchedSection.sectionRef} (${matchedSection.title}) states:\n\n"${matchedSection.originalText.substring(0, 200)}..."\n\nKey Takeaway: Ensure pre-existing IP and tools are explicitly excluded from full client assignment.`
      : "No explicit IP assignment clauses were identified in the scanned document sections.";
  } else {
    matchedSection = analysis.sections[0] || null;
    answer = `Based on Section ${matchedSection?.sectionRef || '[§1.0]'} of your document:\n\n"The document outlines binding obligations between both parties."\n\nFor specific clauses, ask about payment fees, termination terms, or IP rights.`;
  }

  return {
    engineUsed: 'heuristic',
    answer,
    citation: matchedSection ? { sectionRef: matchedSection.sectionRef, title: matchedSection.title } : null
  };
}
