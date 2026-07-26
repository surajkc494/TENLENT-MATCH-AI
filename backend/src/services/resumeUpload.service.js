/**
 * @file resumeUpload.service.js
 * @description Service responsible for handling resume PDF upload validation, unique ID generation, and temporary storage metadata.
 */

import path from 'path';
import { logger } from '../utils/logger.util.js';
import { ApiError } from '../utils/ApiError.util.js';
import { FILE_UPLOAD } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';

export const resumeUploadService = {
  /**
   * Processes uploaded resume PDF file and returns upload metadata.
   * @param {Object} file - Multer file object
   * @returns {Promise<Object>} Upload metadata object containing fileId, filename, size, etc.
   */
  async uploadResumeFile(file) {
    if (!file) {
      throw ApiError.badRequest(`Resume PDF file is required under form field name '${FILE_UPLOAD.FIELD_NAME}'`);
    }

    // Validate MIME type
    if (!FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw ApiError.badRequest(`Invalid MIME type: ${file.mimetype}. Only PDF files are allowed.`);
    }

    // Validate file size (5MB ceiling)
    const maxSizeBytes = envConfig.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw ApiError.badRequest(`File size (${file.size} bytes) exceeds maximum limit of ${envConfig.MAX_UPLOAD_SIZE_MB}MB.`);
    }

    // Generate unique file ID using file basename without extension or crypto timestamp
    const fileId = path.parse(file.filename).name || `resume_${Date.now()}`;

    logger.info(`[resumeUploadService] Resume file stored temporarily: ${file.filename} (fileId: ${fileId}, size: ${file.size} bytes)`);

    return {
      fileId,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date().toISOString(),
    };
  },
};
