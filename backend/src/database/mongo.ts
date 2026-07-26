import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { ENV } from '../config/env';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    // Graceful disconnect on application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    await mongoose.connect(ENV.MONGO_URI, {
      maxPoolSize: 100, // Increased connection pooling for high concurrency
      wtimeoutMS: 2500, // Write timeout
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1); // Fail fast
  }
};
