import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import { logger } from '../utils/logger';

/**
 * Express middleware to cache responses in Redis
 * @param durationInSeconds Cache expiration time
 */
export const cacheMiddleware = (durationInSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate a unique cache key based on the URL and query parameters
    const cacheKey = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redisClient.get(cacheKey);

      if (cachedResponse) {
        logger.debug(`Cache hit for ${cacheKey}`);
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(JSON.parse(cachedResponse));
      }

      logger.debug(`Cache miss for ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');

      // Override res.json to intercept and cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setex(cacheKey, durationInSeconds, JSON.stringify(body)).catch(err => {
             logger.error('Redis cache set error', err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Redis cache middleware error', error);
      // Fallback to normal request processing if Redis fails
      next();
    }
  };
};
