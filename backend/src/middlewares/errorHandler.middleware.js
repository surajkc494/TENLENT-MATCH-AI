/**
 * @file errorHandler.middleware.js
 * @description Centralized error handler middleware for Express application.
 * Formats errors into standardized JSON responses and sanitizes internal details in production.
 */

import multer from 'multer';
import { ApiError } from '../utils/ApiError.util.js';
import { logger } from '../utils/logger.util.js';
import { envConfig } from '../config/env.config.js';
import { HTTP_STATUS } from '../config/constants.js';
import { removeFile } from '../utils/fileCleanup.util.js';

/**
 * Express centralized error handling middleware.
 * Must be registered after all route handlers.
 */
export const errorHandler = async (err, req, res, _next) => {
  let error = err;

  // Cleanup ephemeral uploaded file if error occurs during processing pipeline
  if (req.file && req.file.path) {
    await removeFile(req.file.path);
  }

  // Handle Multer-specific upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = ApiError.badRequest(
        `File size exceeds maximum threshold of ${envConfig.MAX_UPLOAD_SIZE_MB}MB.`
      );
    } else {
      error = ApiError.badRequest(`File upload error: ${err.message}`);
    }
  }

  // Convert standard JS Error or unknown objects into ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, null, err.stack);
  }

  // Log error via application logger
  logger.error(`[${req.method}] ${req.originalUrl} - ${error.message}`, {
    statusCode: error.statusCode,
    details: error.details,
    stack: envConfig.IS_DEVELOPMENT ? error.stack : undefined,
  });

  // Prepare standard error response payload
  const responsePayload = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.details && { details: error.details }),
    ...(envConfig.IS_DEVELOPMENT && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  };

  return res.status(error.statusCode).json(responsePayload);
};
