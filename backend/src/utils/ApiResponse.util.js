/**
 * @file ApiResponse.util.js
 * @description Standardized API response formatter envelope for all controller responses.
 * Guarantees a consistent JSON structure across all success outputs.
 */

import { HTTP_STATUS } from '../config/constants.js';

export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (200, 201, etc.)
   * @param {*} data - Response payload (Object, Array, string, etc.)
   * @param {string} [message='Success'] - Descriptive success message
   */
  constructor(statusCode = HTTP_STATUS.OK, data = null, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Quick static helper for 200 OK
   */
  static success(data, message = 'Request completed successfully') {
    return new ApiResponse(HTTP_STATUS.OK, data, message);
  }

  /**
   * Quick static helper for 201 Created
   */
  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(HTTP_STATUS.CREATED, data, message);
  }
}
