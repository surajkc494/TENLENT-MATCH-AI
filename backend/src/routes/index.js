/**
 * @file index.js
 * @description Central Express API router aggregator.
 * Mounts all sub-routers (health, resume, jobDescription, evaluation) under API version prefix.
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import resumeRoutes from './resume.routes.js';
import jobDescriptionRoutes from './jobDescription.routes.js';
import evaluationRoutes from './evaluation.routes.js';

const router = Router();

// Mount API sub-routes
router.use('/', healthRoutes);
router.use('/resume', resumeRoutes);
router.use('/', resumeRoutes);
router.use('/job-description', jobDescriptionRoutes);
router.use('/evaluation', evaluationRoutes);

export default router;
