import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Auth & Rate Limiting Verification', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let authToken = '';

  it('allows registering a new user without 429 rate limit errors', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: testEmail,
        password: testPassword
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testEmail);
    authToken = res.body.token;
  });

  it('allows multiple consecutive login attempts on localhost without getting 429 rate limited', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    }
  });

  it('returns proper 400 error for wrong password instead of generic 429', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrong_password_attempt'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Incorrect password');
  });

  it('allows authenticated access to /api/auth/me using the token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });
});
