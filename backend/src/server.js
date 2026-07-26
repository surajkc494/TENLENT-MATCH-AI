/**
 * @file server.js
 * @description HTTP Server Entry Point.
 * Starts Express HTTP listener, handles process-level exception events, and manages graceful shutdown.
 */

import app from './app.js';
import { envConfig } from './config/env.config.js';
import { logger } from './utils/logger.util.js';

const PORT = envConfig.PORT;

// Start Server Listener
const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 TalentMatch AI Backend Server running successfully!`);
  logger.info(`🌐 Environment : ${envConfig.NODE_ENV}`);
  logger.info(`📡 Port        : ${PORT}`);
  logger.info(`🔗 Health API  : http://localhost:${PORT}/api/v1/health`);
  logger.info(`=======================================================`);
});

/**
 * Handles graceful server termination closing active sockets cleanly.
 */
const gracefulShutdown = (signal) => {
  logger.warn(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed successfully.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds timeout
  setTimeout(() => {
    logger.error('Forced shutdown: Could not close connections in time.');
    process.exit(1);
  }, 10000);
};

// Process Signal Listeners
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Process Exception Handlers
process.on('uncaughtException', (err) => {
  logger.error('FATAL UNCAUGHT EXCEPTION:', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED PROMISE REJECTION:', { reason });
});
