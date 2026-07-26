/**
 * @file fileCleanup.util.js
 * @description Helper utility to safely remove temporary uploaded files from disk.
 * Prevents storage leaks by cleaning up transient files after processing or errors.
 */

import fs from 'fs/promises';
import { logger } from './logger.util.js';

/**
 * Safely removes a file at the specified file path.
 * @param {string} filePath - Absolute or relative path to the file
 * @returns {Promise<boolean>} True if removed or did not exist, false on failure
 */
export const removeFile = async (filePath) => {
  if (!filePath) return false;

  try {
    await fs.unlink(filePath);
    logger.debug(`[fileCleanup] Successfully deleted temporary file: ${filePath}`);
    return true;
  } catch (error) {
    // If file does not exist, ignore
    if (error.code === 'ENOENT') {
      return true;
    }
    logger.error(`[fileCleanup] Failed to delete file: ${filePath}`, { error: error.message });
    return false;
  }
};
