/**
 * @file logger.util.js
 * @description Centralized application logger supporting severity levels, console output,
 * and persistent stream writing to logs/ combined and error files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { envConfig } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGS_DIR = path.resolve(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const combinedStream = fs.createWriteStream(path.join(LOGS_DIR, 'combined.log'), { flags: 'a' });
const errorStream = fs.createWriteStream(path.join(LOGS_DIR, 'error.log'), { flags: 'a' });

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevelPriority = LEVELS[envConfig.LOG_LEVEL] ?? LEVELS.info;

/**
 * Format log output line.
 */
const formatMessage = (level, message, meta = '') => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}\n`;
};

/**
 * Main logging object exposing standard severity level methods.
 */
export const logger = {
  info: (message, meta) => {
    if (currentLevelPriority >= LEVELS.info) {
      const formatted = formatMessage('info', message, meta);
      console.log(formatted.trim());
      combinedStream.write(formatted);
    }
  },

  warn: (message, meta) => {
    if (currentLevelPriority >= LEVELS.warn) {
      const formatted = formatMessage('warn', message, meta);
      console.warn(formatted.trim());
      combinedStream.write(formatted);
    }
  },

  error: (message, meta) => {
    if (currentLevelPriority >= LEVELS.error) {
      const formatted = formatMessage('error', message, meta);
      console.error(formatted.trim());
      combinedStream.write(formatted);
      errorStream.write(formatted);
    }
  },

  debug: (message, meta) => {
    if (currentLevelPriority >= LEVELS.debug) {
      const formatted = formatMessage('debug', message, meta);
      console.debug(formatted.trim());
      combinedStream.write(formatted);
    }
  },
};
