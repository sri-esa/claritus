import { describe, test, expect } from 'vitest';
import { analyzeDocumentHeuristically } from '../engine/heuristicLegalEngine.js';

describe('Risk Analyzer & Tri-Token Specification Tests', () => {
  test('detects unlimited indemnification and tags as critical risk with AlertOctagon icon', () => {
    const text = `SECTION 1. INDEMNIFICATION
Tenant agrees to defend, indemnify, and hold harmless Landlord from any and all claims, regardless of Landlord's negligence.`;

    const result = analyzeDocumentHeuristically(text);
    expect(result.riskCounts.critical).toBe(1);
    expect(result.riskItems[0].severity).toBe('critical');
    expect(result.riskItems[0].label).toBe('Critical Risk');
    expect(result.riskItems[0].iconName).toBe('AlertOctagon');
    expect(result.riskItems[0].suggestedLanguage).toBeDefined();
  });

  test('calculates safety score deductions correctly', () => {
    const text = `SECTION 1. INDEMNIFICATION
Indemnify and hold harmless landlord.

SECTION 2. AUTOMATIC RENEWAL
This lease automatically renews for 24 months.`;

    const result = analyzeDocumentHeuristically(text);
    expect(result.overallScore).toBeLessThan(100);
    expect(result.riskCounts.critical).toBe(1);
    expect(result.riskCounts.high).toBe(1);
  });
});
