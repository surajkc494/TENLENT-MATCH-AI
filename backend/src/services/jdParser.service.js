/**
 * @file jdParser.service.js
 * @description Service responsible for normalizing and structuring raw Job Description text via Gemini.
 */

import { logger } from '../utils/logger.util.js';

export const jdParserService = {
  /**
   * Stub method to parse raw job description text into normalized JSON format.
   * @param {string} rawJdText - Raw Job Description text payload
   * @returns {Promise<Object>} Structured JD JSON
   */
  async parseJobDescription(rawJdText) {
    logger.info(`[jdParserService] Processing raw JD text length: ${rawJdText.length}`);

    // Mock parsing step - Business logic will be implemented here
    return {
      rawTextLength: rawJdText.length,
      parsedJd: {
        jobTitle: 'Senior Full Stack Engineer',
        requiredSkills: {
          mustHave: ['Node.js', 'Express', 'React'],
          niceToHave: ['Docker', 'AWS'],
        },
        minimumExperienceYears: 4,
      },
    };
  },
};
