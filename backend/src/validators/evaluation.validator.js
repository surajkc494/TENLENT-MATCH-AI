/**
 * @file evaluation.validator.js
 * @description Input validation rules for full Resume-JD evaluation pipeline execution.
 */

import { body } from 'express-validator';

export const validateEvaluationRequest = [
  body('resumeData')
    .exists()
    .withMessage('Parsed resume data object or content is required'),
  body('jobDescription')
    .exists({ checkFalsy: true })
    .withMessage('Job description text or structured data is required'),
];
