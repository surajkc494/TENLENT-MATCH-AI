/**
 * @file health.routes.js
 * @description Route definition for system health check.
 */

import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

// GET /api/v1/health
router.get('/health', checkHealth);

export default router;
