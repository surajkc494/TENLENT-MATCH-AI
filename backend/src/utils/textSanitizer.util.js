/**
 * @file textSanitizer.util.js
 * @description Utility functions for cleaning and formatting extracted text.
 * Removes redundant whitespace while strictly preserving paragraph and section structure.
 */

/**
 * Sanitizes and normalizes raw text extracted from PDF documents.
 * 
 * Rules:
 * 1. Normalize carriage returns (\r\n -> \n, \r -> \n).
 * 2. Replace non-breaking spaces (\u00A0) and zero-width spaces with standard spaces.
 * 3. Trim horizontal whitespace (spaces/tabs) on each line.
 * 4. Collapse multiple consecutive horizontal spaces into a single space.
 * 5. Preserve distinct paragraph breaks (double newlines \n\n) while collapsing 3+ newlines into 2.
 * 6. Strip leading and trailing whitespace from the full document.
 * 
 * @param {string} rawText - Raw text extracted from document
 * @returns {string} Sanitized, structured text
 */
export const cleanExtractedText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  return rawText
    // 1. Normalize newline line endings (\r\n or \r -> \n)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // 2. Replace non-breaking spaces, form feeds, and zero-width spaces with standard space
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    // 3. Collapse multiple horizontal spaces/tabs on each line to a single space
    .replace(/[ \t]+/g, ' ')
    // 4. Clean spaces surrounding line breaks
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    // 5. Preserve paragraph structure (double newlines) but collapse 3+ newlines to 2
    .replace(/\n{3,}/g, '\n\n')
    // 6. Final trim of leading/trailing space
    .trim();
};
