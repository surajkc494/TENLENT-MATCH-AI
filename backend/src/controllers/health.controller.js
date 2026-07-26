/**
 * @file health.controller.js
 * @description Controller for application health check endpoint.
 * Returns server operational status, environment, uptime, and timestamp.
 */

import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { envConfig } from '../config/env.config.js';

/**
 * Health check handler returning server telemetry.
 * GET /api/v1/health
 */
export const checkHealth = asyncHandler(async (_req, res) => {
  const healthData = {
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    environment: envConfig.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json(ApiResponse.success(healthData, 'TalentMatch AI API is operational'));
});
