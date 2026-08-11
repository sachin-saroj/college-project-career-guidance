import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';

describe('Global Error Handler & asyncHandler Middleware', () => {
  let testApp;

  beforeAll(() => {
    testApp = express();
    testApp.use(express.json());

    // Test async route that throws an unhandled error
    testApp.get('/test-async-error', asyncHandler(async (req, res) => {
      throw new Error('Database connection failed');
    }));

    // Test async route that throws custom status error
    testApp.get('/test-custom-status-error', asyncHandler(async (req, res) => {
      const err = new Error('Custom Unauthorized Access');
      err.status = 401;
      throw err;
    }));

    // Global error handler matching server.js pattern
    testApp.use((err, req, res, next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';

      res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
      });
    });

  });

  it('should catch async errors via asyncHandler and route to global error handler', async () => {
    const res = await request(testApp).get('/test-async-error');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database connection failed');
    expect(res.body).toHaveProperty('stack');
  });

  it('should preserve custom error status code when provided', async () => {
    const res = await request(testApp).get('/test-custom-status-error');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Custom Unauthorized Access');
  });

  it('should omit stack trace when NODE_ENV is production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const res = await request(testApp).get('/test-async-error');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database connection failed');
    expect(res.body.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
