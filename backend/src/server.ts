import app from './app';
import { connectDB } from './database/mongo';
import { ENV } from './config/env';
import { logger } from './utils/logger';

// 1. Uncaught Exception Handler (Must be first to catch synchronous errors)
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

// 2. Application Bootstrap Sequence
const startServer = async () => {
  try {
    // 2a. Environment Variables are already validated inside config/env.ts upon import.
    logger.info(`Starting application in ${ENV.NODE_ENV} mode...`);

    // 2b. Database Connection
    await connectDB();

    // 2c. Start Express server
    const server = app.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
    });

    // 3. Unhandled Rejection Handler (Async errors outside express)
    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // 4. Graceful Shutdown (SIGTERM / SIGINT)
    const gracefulShutdown = () => {
      logger.info('SIGTERM/SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        // mongoose.connection.close() is handled in database/mongo.ts
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('❌ Application bootstrap failed', error);
    process.exit(1);
  }
};

startServer();
