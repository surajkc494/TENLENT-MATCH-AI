/**
 * @file evaluation.routes.js
 * @description Express route definitions for full matching pipeline evaluation.
 */

import { Router } from 'express';
import { processEvaluation } from '../controllers/evaluation.controller.js';
import { validateEvaluationRequest } from '../validators/evaluation.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/v1/evaluation/process
router.post(
  '/process',
  validateEvaluationRequest,
  validate,
  processEvaluation
);

export default router;
