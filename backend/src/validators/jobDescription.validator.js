/**
 * @file jobDescription.validator.js
 * @description Input validation rules for Job Description parsing route.
 */

import { body } from 'express-validator';

export const validateJobDescription = [
  body('jobDescription')
    .exists({ checkFalsy: true })
    .withMessage('Job description content is required')
    .isString()
    .withMessage('Job description must be a string')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Job description text must be at least 50 characters long for accurate AI parsing')
    .isLength({ max: 20000 })
    .withMessage('Job description text cannot exceed 20,000 characters'),
];
