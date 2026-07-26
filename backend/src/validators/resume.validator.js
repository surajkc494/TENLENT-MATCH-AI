/**
 * @file resume.validator.js
 * @description Input validation chains for resume parsing routes using express-validator.
 */

import path from 'path';
import { FILE_UPLOAD } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';
import { ApiError } from '../utils/ApiError.util.js';

export const validateResumeUpload = [
  // Custom validation middleware for uploaded file
  (req, _res, next) => {
    if (!req.file) {
      return next(
        ApiError.badRequest(`Resume PDF file is required under form field name '${FILE_UPLOAD.FIELD_NAME}'`)
      );
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const isAllowedMime = FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(req.file.mimetype);
    const isAllowedExt = FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(ext);

    if (!isAllowedMime || !isAllowedExt) {
      return next(
        ApiError.badRequest(
          `Invalid file format. Only PDF files (${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}) are allowed.`
        )
      );
    }

    const maxSizeBytes = envConfig.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
    if (req.file.size > maxSizeBytes) {
      return next(
        ApiError.badRequest(
          `File size exceeds maximum threshold of ${envConfig.MAX_UPLOAD_SIZE_MB}MB.`
        )
      );
    }

    return next();
  },
];
