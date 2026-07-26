/**
 * @file validate.middleware.js
 * @description Express middleware to process validation results from express-validator.
 * Short-circuits the request pipeline with a formatted ApiError if validation fails.
 */

import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.util.js';

/**
 * Validates request data against registered validation chains.
 */
export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return next(
      ApiError.unprocessableEntity('Validation failed for request parameters', formattedErrors)
    );
  }

  return next();
};
