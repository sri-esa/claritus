import { describe, test, expect } from 'vitest';
import { analyzeDocumentHeuristically } from '../engine/heuristicLegalEngine.js';
import { chunkDocumentText } from '../engine/sectionChunker.js';

describe('Claritus Edge Cases & Robustness Tests', () => {
  test('handles empty document input gracefully without crashing', () => {
    const result1 = analyzeDocumentHeuristically("");
    expect(result1.isEmpty).toBe(true);
    expect(result1.overallScore).toBe(100);

    const result2 = analyzeDocumentHeuristically(null);
    expect(result2.isEmpty).toBe(true);
  });

  test('handles scanned image PDF text (< 10 words) with scannedPdf alert flag', () => {
    const text = "Image scan 123";
    const result = analyzeDocumentHeuristically(text);
    expect(result.isScannedPdf).toBe(true);
    expect(result.sections.length).toBe(0);
  });

  test('handles oversized document text (> 20,000 words) safely', () => {
    const paragraph = "SECTION 1. OBLIGATIONS\nParty agrees to perform standard operational duties under law.\n";
    const oversizedText = paragraph.repeat(1500);

    const result = chunkDocumentText(oversizedText);
    expect(result.totalWords).toBeGreaterThan(15000);
    expect(result.sections.length).toBeGreaterThan(0);
  });

  test('handles malformed non-legal text gracefully', () => {
    const text = "Random quick brown fox jumps over the lazy dog. Hello world sample text.";
    const result = analyzeDocumentHeuristically(text);
    expect(result.isEmpty).toBe(false);
    expect(result.riskCounts.critical).toBe(0);
    expect(result.overallScore).toBe(100);
  });

  test('sanitizes potential XSS script tags safely into text nodes', () => {
    const text = `SECTION 1. TITLE
<script>alert('XSS Payload')</script>`;
    const result = analyzeDocumentHeuristically(text);
    expect(result.sections[0].originalText).toContain('<script>');
    // Ensure plain text extraction doesn't execute
    expect(result.sections[0].plainEnglish).toBeDefined();
  });
});
