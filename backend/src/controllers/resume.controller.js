/**
 * @file resume.controller.js
 * @description HTTP Controller handling resume uploads, text extraction, and parsing delegation.
 */

import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { HTTP_STATUS } from '../config/constants.js';
import { resumeUploadService } from '../services/resumeUpload.service.js';
import { resumeExtractorService } from '../services/resumeExtractor.service.js';
import { resumeParserService } from '../services/resumeParser.service.js';

/**
 * Uploads resume PDF document and returns metadata.
 * POST /api/v1/resume/upload
 */
export const uploadResume = asyncHandler(async (req, res) => {
  const file = req.file;

  const metadata = await resumeUploadService.uploadResumeFile(file);
  const parsedResult = await resumeParserService.parseResumeFile(file);

  const response = ApiResponse.success(
    {
      ...metadata,
      parsedData: parsedResult.parsedData,
      candidateInfo: parsedResult.candidateInfo,
      skills: parsedResult.skills,
      experienceYears: parsedResult.experienceYears,
      extractedText: parsedResult.extractedText,
      numPages: parsedResult.numPages,
    },
    'Resume uploaded successfully'
  );
  response.fileId = metadata.fileId;
  response.filename = metadata.filename;
  response.size = metadata.size;

  return res.status(HTTP_STATUS.OK).json(response);
});

/**
 * Extracts readable clean text from uploaded resume PDF.
 * POST /api/v1/resume/extract-text
 */
export const extractResumeText = asyncHandler(async (req, res) => {
  const file = req.file;

  const result = await resumeExtractorService.extractText(file);

  const response = ApiResponse.success(result, 'Resume text extracted successfully');
  response.text = result.text;

  return res.status(HTTP_STATUS.OK).json(response);
});

/**
 * Parses uploaded resume PDF document.
 * POST /api/v1/resume/parse
 */
export const parseResume = asyncHandler(async (req, res) => {
  const file = req.file;

  const parsedResult = await resumeParserService.parseResumeFile(file);

  return res.status(HTTP_STATUS.OK).json(ApiResponse.success(parsedResult, 'Resume parsed successfully'));
});
