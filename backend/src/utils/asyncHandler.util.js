/**
 * @file asyncHandler.util.js
 * @description Higher-Order Function wrapper for async Express controllers.
 * Eliminates repetitive try-catch blocks by forwarding rejected promises to next().
 */

/**
 * Wraps an async route handler / controller function.
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
