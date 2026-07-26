/**
 * @file explanation.service.js
 * @description Service responsible for generating recruiter explanations and candidate suggestions via Gemini.
 */

import { logger } from '../utils/logger.util.js';

export const explanationService = {
  /**
   * Stub method to generate natural language breakdown and improvement suggestions.
   * @param {Object} scoringResult - Computed scores breakdown
   * @returns {Promise<Object>} Recruiter explanation and candidate suggestions
   */
  async generateExplanation(scoringResult) {
    logger.info('[explanationService] Generating AI narrative explanations (Stub)');

    return {
      recruiterSummary: 'Strong match for senior engineering requirements with solid core backend experience.',
      matchedSkills: ['Node.js', 'Express', 'JavaScript'],
      missingSkills: ['Docker', 'Kubernetes'],
      recommendations: [
        'Highlight containerization experience if available.',
        'Add quantitative metric impacts for recent roles.',
      ],
    };
  },
};
