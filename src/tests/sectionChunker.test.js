import { describe, test, expect } from 'vitest';
import { chunkDocumentText } from '../engine/sectionChunker.js';

describe('Document Section Chunker Tests', () => {
  test('correctly chunks text into numbered sections with sectionRef', () => {
    const rawText = `SECTION 1. PREMISES
Landlord leases to Tenant premises.

SECTION 2. RENT AND FEES
Tenant agrees to pay monthly rent.`;

    const result = chunkDocumentText(rawText);
    expect(result.sections.length).toBe(2);
    expect(result.sections[0].sectionRef).toBe('[§1.0]');
    expect(result.sections[1].sectionRef).toBe('[§2.0]');
    expect(result.totalWords).toBeGreaterThan(10);
    expect(result.isScannedPdf).toBe(false);
  });

  test('correctly identifies scanned PDF with low word count', () => {
    const scannedText = "Scan 123";
    const result = chunkDocumentText(scannedText);
    expect(result.isScannedPdf).toBe(true);
    expect(result.sections.length).toBe(0);
  });
});
