/**
 * @file ApiError.util.js
 * @description Custom operational error class extending standard JS Error.
 * Standardizes HTTP error responses across services, controllers, and middlewares.
 */

import { HTTP_STATUS } from '../config/constants.js';

export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
   * @param {string} message - Human-readable error description
   * @param {Array|Object|null} [details=null] - Additional validation or error context
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = 'An unexpected error occurred',
    details = null,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.details = details;
    this.isOperational = true; // Distinguishes operational errors from programming bugs

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Factory method for Bad Request (400)
   */
  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, details);
  }

  /**
   * Factory method for Unauthorized (401)
   */
  static unauthorized(message = 'Unauthorized access', details = null) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message, details);
  }

  /**
   * Factory method for Forbidden (403)
   */
  static forbidden(message = 'Forbidden action', details = null) {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message, details);
  }

  /**
   * Factory method for Not Found (404)
   */
  static notFound(message = 'Resource not found', details = null) {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message, details);
  }

  /**
   * Factory method for Unprocessable Entity (422)
   */
  static unprocessableEntity(message = 'Validation failed', details = null) {
    return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, details);
  }

  /**
   * Factory method for Internal Server Error (500)
   */
  static internal(message = 'Internal Server Error', details = null) {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, details);
  }
}
