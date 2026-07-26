/**
 * @file scoring.service.js
 * @description Service responsible for calculating weighted category and overall match scores.
 */

import { SCORING_WEIGHTS } from '../config/constants.js';
import { logger } from '../utils/logger.util.js';

export const scoringService = {
  /**
   * Stub method to calculate final weighted score based on similarity metrics.
   * @param {Object} similarityScores - Similarity metrics per section
   * @returns {Object} Aggregated final weighted scores
   */
  calculateOverallScore(similarityScores) {
    logger.info('[scoringService] Aggregating weighted scores (Stub)');

    const techScore = (similarityScores.technicalSkillsSimilarity || 0) * SCORING_WEIGHTS.TECHNICAL_SKILLS * 100;
    const expScore = (similarityScores.experienceSimilarity || 0) * SCORING_WEIGHTS.EXPERIENCE_RELEVANCE * 100;
    const eduScore = (similarityScores.educationSimilarity || 0) * SCORING_WEIGHTS.EDUCATION_CERTIFICATIONS * 100;
    const softScore = (similarityScores.softSkillsSimilarity || 0) * SCORING_WEIGHTS.SOFT_SKILLS * 100;

    const overallScore = Math.round(techScore + expScore + eduScore + softScore);

    return {
      overallScore,
      breakdown: {
        technicalSkillsScore: Math.round((similarityScores.technicalSkillsSimilarity || 0) * 100),
        experienceRelevanceScore: Math.round((similarityScores.experienceSimilarity || 0) * 100),
        educationScore: Math.round((similarityScores.educationSimilarity || 0) * 100),
        softSkillsScore: Math.round((similarityScores.softSkillsSimilarity || 0) * 100),
      },
    };
  },
};
