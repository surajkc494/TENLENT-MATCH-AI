/**
 * @file pdfExtractor.util.js
 * @description Utility to parse PDF files or buffers using pdf-parse and handle extraction errors.
 */

import fs from 'fs';
import { createRequire } from 'module';
import { ApiError } from './ApiError.util.js';
import { logger } from './logger.util.js';

// Load CommonJS module pdf-parse reliably across ES Modules environments
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');

/**
 * Extracts raw readable text from a PDF file path or Buffer using pdf-parse.
 * Supports both legacy function API and class PDFParse API.
 * @param {string|Buffer} source - Absolute file path or Buffer object of the PDF
 * @returns {Promise<{ rawText: string, numPages: number, info: Object }>} Extracted PDF raw text & metadata
 */
export const extractPdfRawText = async (source) => {
  let dataBuffer;

  if (Buffer.isBuffer(source)) {
    dataBuffer = source;
  } else if (typeof source === 'string') {
    if (!fs.existsSync(source)) {
      throw ApiError.notFound(`PDF file not found at path: ${source}`);
    }
    try {
      dataBuffer = fs.readFileSync(source);
    } catch (err) {
      logger.error(`[pdfExtractor] Failed to read PDF file from disk: ${err.message}`);
      throw ApiError.internal(`Failed to read PDF file from disk: ${err.message}`);
    }
  } else {
    throw ApiError.badRequest('Invalid PDF input. Expected a valid file path or Buffer.');
  }

  if (!dataBuffer || dataBuffer.length === 0) {
    throw ApiError.badRequest('PDF buffer is empty or unreadable.');
  }

  try {
    let text = '';
    let numPages = 1;
    let info = {};

    if (typeof pdfParseModule === 'function') {
      const result = await pdfParseModule(dataBuffer);
      text = result?.text || '';
      numPages = result?.numpages || 1;
      info = result?.info || {};
    } else if (pdfParseModule && pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
      const textResult = await parser.getText();

      if (typeof textResult === 'string') {
        text = textResult;
      } else if (textResult && typeof textResult.text === 'string') {
        text = textResult.text;
      } else if (textResult && Array.isArray(textResult.pages)) {
        text = textResult.pages.map((p) => p.text || '').join('\n\n');
      }

      numPages = textResult?.numPages || textResult?.numpages || parser.doc?.numPages || 1;

      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    } else if (pdfParseModule && typeof pdfParseModule.default === 'function') {
      const result = await pdfParseModule.default(dataBuffer);
      text = result?.text || '';
      numPages = result?.numpages || 1;
      info = result?.info || {};
    } else {
      throw new Error('Unsupported pdf-parse module structure.');
    }

    if (typeof text !== 'string') {
      throw ApiError.unprocessableEntity('Failed to parse text from PDF document.');
    }

    return {
      rawText: text,
      numPages,
      info,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    logger.warn(`[pdfExtractor] pdf-parse fallback triggered: ${err.message}`);

    const fallbackText = dataBuffer.toString('utf8').replace(/\x00/g, '').trim();
    const fallbackTextLines = fallbackText.split(/\r?\n/).filter(Boolean);

    if (fallbackTextLines.length > 0) {
      return {
        rawText: fallbackTextLines.join('\n'),
        numPages: 1,
        info: {},
      };
    }

    throw ApiError.badRequest(
      `Failed to parse PDF document. File may be corrupted, password-protected, or invalid: ${err.message}`
    );
  }
};
