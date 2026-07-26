/**
 * @file requestLogger.middleware.js
 * @description Integrates Morgan HTTP access logger with application logger utility.
 */

import morgan from 'morgan';
import { logger } from '../utils/logger.util.js';
import { envConfig } from '../config/env.config.js';

// Stream object for Morgan to write logs into our custom application logger
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Use 'combined' format for production, 'dev' for local testing
const format = envConfig.IS_PRODUCTION ? 'combined' : 'dev';

export const requestLogger = morgan(format, { stream });
