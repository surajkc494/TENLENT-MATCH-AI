/**
 * @file resumeExtractor.service.js
 * @description Business logic service for reading uploaded PDF resumes and extracting cleaned text.
 */

import { extractPdfRawText } from '../utils/pdfExtractor.util.js';
import { cleanExtractedText } from '../utils/textSanitizer.util.js';
import { ApiError } from '../utils/ApiError.util.js';
import { logger } from '../utils/logger.util.js';

export const resumeExtractorService = {
  /**
   * Extracts clean text from an uploaded PDF file object or file path.
   * 
   * @param {Object|string} fileOrPath - Multer file object or file path string
   * @returns {Promise<{ text: string, numPages: number, charCount: number }>} Object containing clean text & metadata
   */
  async extractText(fileOrPath) {
    let source;

    if (typeof fileOrPath === 'string') {
      source = fileOrPath;
    } else if (fileOrPath && fileOrPath.path) {
      source = fileOrPath.path;
    } else if (fileOrPath && fileOrPath.buffer) {
      source = fileOrPath.buffer;
    } else {
      throw ApiError.badRequest('No valid PDF file or file path provided for text extraction.');
    }

    logger.info(`[resumeExtractorService] Extracting text from PDF source...`);

    // Step 1: Parse raw text from PDF using pdf-parse utility
    const { rawText, numPages } = await extractPdfRawText(source);

    // Step 2: Sanitize raw text, removing excessive whitespace while preserving paragraph breaks
    const cleanText = cleanExtractedText(rawText);

    // Step 3: Validate extracted readable content
    if (!cleanText || cleanText.trim().length === 0) {
      throw ApiError.unprocessableEntity(
        'No readable text could be extracted from the PDF. The document may be scanned, image-based, or empty.'
      );
    }

    logger.info(
      `[resumeExtractorService] Successfully extracted ${cleanText.length} characters across ${numPages} page(s).`
    );

    return {
      text: cleanText,
      numPages,
      charCount: cleanText.length,
    };
  },
};
