/**
 * @file upload.middleware.js
 * @description Configures Multer storage engine, file size limits, and PDF MIME filter.
 * Ensures uploads directory exists and rejects non-PDF file submissions.
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { FILE_UPLOAD } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';
import { ApiError } from '../utils/ApiError.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

// Ensure upload destination folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Generate unique timestamp filename: resume-1700000000000-123456789.pdf
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File Filter: Enforce PDF format strictly
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowedMime = FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isAllowedExt = FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(ext);

  if (isAllowedMime && isAllowedExt) {
    return cb(null, true);
  }

  return cb(
    ApiError.badRequest(
      `Invalid file type. Only PDF documents (${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}) are accepted.`
    ),
    false
  );
};

// Maximum Upload Limit calculation in Bytes
const maxSizeBytes = envConfig.MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSizeBytes,
  },
});
