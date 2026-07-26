/**
 * @file constants.js
 * @description Centralized constants used across the TalentMatch AI backend application.
 * Defines HTTP status codes, file upload parameters, scoring rules, and API defaults.
 */

// HTTP Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// File Upload Constraints
export const FILE_UPLOAD = {
  ALLOWED_MIME_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB default ceiling
  FIELD_NAME: 'resume',
  TEMP_UPLOAD_DIR: 'uploads',
};

// Application API Defaults
export const API_CONFIG = {
  DEFAULT_PORT: 5000,
  API_PREFIX: '/api/v1',
  DEFAULT_ENV: 'development',
};

// Evaluation Scoring Constants
export const SCORING_WEIGHTS = {
  TECHNICAL_SKILLS: 0.40,
  EXPERIENCE_RELEVANCE: 0.35,
  EDUCATION_CERTIFICATIONS: 0.15,
  SOFT_SKILLS: 0.10,
};
