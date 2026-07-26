/**
 * @file evaluation.controller.js
 * @description HTTP Controller orchestrating full match evaluation between Resume and JD.
 */

import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { embeddingSimilarityService } from '../services/embeddingSimilarity.service.js';
import { scoringService } from '../services/scoring.service.js';
import { explanationService } from '../services/explanation.service.js';

/**
 * Triggers full evaluation pipeline.
 * POST /api/v1/evaluation/process
 */
export const processEvaluation = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  // Step 1: Compute similarity scores
  const similarityScores = await embeddingSimilarityService.computeSimilarity(resumeData, jobDescription);

  // Step 2: Calculate category breakdown and overall match score
  const scoringResult = scoringService.calculateOverallScore(similarityScores);

  // Step 3: Generate recruiter narrative & candidate recommendations
  const explanationResult = await explanationService.generateExplanation(scoringResult);

  const finalReport = {
    evaluationId: `eval_${Date.now()}`,
    scores: scoringResult,
    insights: explanationResult,
  };

  return res.status(200).json(ApiResponse.success(finalReport, 'Evaluation completed successfully'));
});
