/**
 * @file jobDescription.controller.js
 * @description HTTP Controller handling job description parsing.
 */

import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { jdParserService } from '../services/jdParser.service.js';

/**
 * Parses raw job description text into structured JSON format.
 * POST /api/v1/job-description/parse
 */
export const parseJobDescription = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  // Delegate processing to JD parser service
  const parsedResult = await jdParserService.parseJobDescription(jobDescription);

  return res.status(200).json(ApiResponse.success(parsedResult, 'Job description parsed successfully'));
});
