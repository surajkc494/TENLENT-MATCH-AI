/**
 * @file resume.routes.js
 * @description Express route definitions for resume upload, text extraction, and parsing endpoints.
 */

import { Router } from 'express';
import { uploadResume, extractResumeText, parseResume } from '../controllers/resume.controller.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import { validateResumeUpload } from '../validators/resume.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { FILE_UPLOAD } from '../config/constants.js';

const router = Router();

// POST /api/v1/resume/upload - Upload resume PDF and return upload metadata
router.post(
  '/upload',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  uploadResume
);

// POST /api/v1/upload - Compatibility alias for the frontend's current upload contract
router.post(
  '/upload',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  uploadResume
);

// POST /api/v1/resume - Alias for resume upload
router.post(
  '/',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  uploadResume
);

// POST /api/v1/resume/extract-text - Extract clean text from resume PDF
router.post(
  '/extract-text',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  extractResumeText
);

// POST /api/v1/resume/extract - Alias for text extraction
router.post(
  '/extract',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  extractResumeText
);

// POST /api/v1/resume/parse - Upload and parse resume PDF content
router.post(
  '/parse',
  uploadMiddleware.single(FILE_UPLOAD.FIELD_NAME),
  validateResumeUpload,
  validate,
  parseResume
);

export default router;
