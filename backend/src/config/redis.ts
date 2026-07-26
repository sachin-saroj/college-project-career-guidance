import Redis from 'ioredis';
import { ENV } from './env';
import { logger } from '../utils/logger';

// Create a Redis instance
// We use a singleton pattern for the Redis client
const redisClient = new Redis(ENV.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis connection error:', err);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  redisClient.quit();
});

export default redisClient;
