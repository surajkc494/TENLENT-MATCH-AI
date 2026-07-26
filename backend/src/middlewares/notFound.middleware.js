/**
 * @file notFound.middleware.js
 * @description Catches unmatched HTTP requests (404) and forwards a structured ApiError.
 */

import { ApiError } from '../utils/ApiError.util.js';

export const notFoundHandler = (req, _res, next) => {
  const error = ApiError.notFound(`Cannot ${req.method} ${req.originalUrl} - Route not found`);
  next(error);
};
