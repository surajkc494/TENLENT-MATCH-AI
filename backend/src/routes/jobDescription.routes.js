/**
 * @file jobDescription.routes.js
 * @description Express route definitions for job description submission and parsing.
 */

import { Router } from 'express';
import { parseJobDescription } from '../controllers/jobDescription.controller.js';
import { validateJobDescription } from '../validators/jobDescription.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/v1/job-description/parse
router.post(
  '/parse',
  validateJobDescription,
  validate,
  parseJobDescription
);

export default router;
