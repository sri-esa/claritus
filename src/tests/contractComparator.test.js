import { describe, test, expect } from 'vitest';
import { compareDocumentsHeuristically } from '../engine/heuristicLegalEngine.js';

describe('Contract Side-by-Side Comparator Tests', () => {
  test('accurately detects added clauses and safety score shift', () => {
    const docA = `SECTION 1. PREMISES
Standard terms apply.`;

    const docB = `SECTION 1. PREMISES
Standard terms apply.

SECTION 2. INDEMNIFICATION
Tenant shall indemnify landlord for all claims.`;

    const result = compareDocumentsHeuristically(docA, docB);
    expect(result.newObligationsCount).toBe(1);
    expect(result.scoreShift).toBeLessThan(0);
    expect(result.comparisonRows.length).toBe(2);
  });
});
