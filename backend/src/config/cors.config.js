/**
 * @file cors.config.js
 * @description Configures Cross-Origin Resource Sharing (CORS) options for Express.
 * Implements a strict origin whitelist mechanism based on environment configuration.
 */

import { envConfig } from './env.config.js';

/**
 * Generates CORS options dynamically.
 * Validates request origin against allowed origins in environment.
 */
export const getCorsOptions = () => {
  const rawOrigins = envConfig.CORS_ORIGIN || '*';
  const allowedOrigins = rawOrigins.split(',').map((origin) => origin.trim());

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) in development
      const isLocalDevelopmentOrigin = envConfig.IS_DEVELOPMENT && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin) {
        return callback(null, true);
      }
      return callback(new Error(`CORS Policy Violation: Origin '${origin}' is not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Legacy browser support
  };
};
