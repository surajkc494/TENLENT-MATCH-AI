/**
 * @file embeddingSimilarity.service.js
 * @description Service responsible for computing vector embeddings and semantic similarity scores.
 */

import { logger } from '../utils/logger.util.js';

export const embeddingSimilarityService = {
  /**
   * Stub method to compute similarity vector scores between resume and job description.
   * @param {Object} resumeData - Structured resume data
   * @param {Object} jdData - Structured job description data
   * @returns {Promise<Object>} Similarity scores per section
   */
  async computeSimilarity(resumeData, jdData) {
    logger.info('[embeddingSimilarityService] Computing similarity scores (Stub)');

    return {
      technicalSkillsSimilarity: 0.85,
      experienceSimilarity: 0.80,
      educationSimilarity: 0.90,
      softSkillsSimilarity: 0.75,
    };
  },
};
