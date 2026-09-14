/**
 * Claritus Section Chunker
 * Splits raw legal document text into structured, indexed section objects
 * with line ranges, titles, and unique section reference IDs ([§X.Y]).
 */

export function chunkDocumentText(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      sections: [],
      totalLines: 0,
      totalWords: 0,
      isScannedPdf: false,
      isEmpty: true
    };
  }

  const trimmed = rawText.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Detect scanned / image PDF with no extractable text
  if (totalWords < 5) {
    return {
      sections: [],
      totalLines: 0,
      totalWords,
      isScannedPdf: true,
      isEmpty: false
    };
  }

  const lines = rawText.split('\n');
  const sections = [];
  
  let currentSection = null;
  let sectionIndex = 1;
  let subsectionIndex = 1;

  // Regex patterns for detecting section headers
  const sectionHeaderPattern = /^(?:SECTION|ARTICLE|CLAUSE)\s+\d+|^\d+[\.\)]\s+/i;
  const numPattern = /(?:SECTION|ARTICLE|CLAUSE)?\s*(\d+)(?:\.(\d+))?[\.\s\)]*(.*)/i;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    if (!trimmedLine) return;

    // Check if line looks like a header or new clause
    const matchHeader = sectionHeaderPattern.test(trimmedLine);

    if ((matchHeader && currentSection) || !currentSection) {
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }

      // Generate section ID like SEC-1.0 or SEC-2.1
      let sectionRef = `[§${sectionIndex}.0]`;
      let sectionTitle = trimmedLine;

      const numMatch = trimmedLine.match(numPattern);
      if (numMatch) {
        const maj = numMatch[1];
        const min = numMatch[2] || '0';
        sectionRef = `[§${maj}.${min}]`;
        if (numMatch[3]) {
          sectionTitle = numMatch[3].trim();
        }
      } else {
        sectionIndex++;
      }

      currentSection = {
        id: `SEC-${sections.length + 1}`,
        sectionRef,
        title: sectionTitle.substring(0, 100) || `Section ${sections.length + 1}`,
        content: line + '\n',
        lineRange: [lineNumber, lineNumber]
      };
    } else {
      currentSection.content += line + '\n';
      currentSection.lineRange[1] = lineNumber;
    }
  });

  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return {
    sections,
    totalLines: lines.length,
    totalWords,
    isScannedPdf: false,
    isEmpty: false
  };
}
