/**
 * @file app.js
 * @description Express Application Factory.
 * Configures security middleware, logging, body parsing, API versioned routes, 404 handler, and error middleware.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { getCorsOptions } from './config/cors.config.js';
import { API_CONFIG } from './config/constants.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import apiRouter from './routes/index.js';

// Initialize Express App
const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS)
app.use(cors(getCorsOptions()));

// 3. HTTP Request Access Logging (Morgan)
app.use(requestLogger);

// 4. Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Root Health / Welcome Route
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'TalentMatch AI Backend API',
    version: '1.0.0',
    documentation: `${API_CONFIG.API_PREFIX}/health`,
    status: 'operational',
  });
});

// 6. Versioned API Routes Aggregator
app.use(API_CONFIG.API_PREFIX, apiRouter);

// 7. Unmatched Route Handler (404)
app.use(notFoundHandler);

// 8. Centralized Error Handler (Registered Last)
app.use(errorHandler);

export default app;
