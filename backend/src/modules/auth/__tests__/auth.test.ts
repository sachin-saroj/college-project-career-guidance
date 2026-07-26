import request from 'supertest';
import app from '../../../app'; // Adjust path if needed
import { User } from '../models/User';
import mongoose from 'mongoose';

describe('Auth API Endpoints', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'student'
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(mockUser.email);
      expect(res.body.data.user.password).toBeUndefined(); // Should not return password
    });

    it('should fail if email is already registered', async () => {
      // Register first
      await request(app).post('/api/v1/auth/register').send(mockUser);
      
      // Try again
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(mockUser);

      expect(res.status).toBe(400); // Bad Request (Email exists)
      expect(res.body.status).toBe('error');
    });

    it('should fail validation with weak password', async () => {
      const weakUser = { ...mockUser, password: '123' };
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(weakUser);

      expect(res.status).toBe(400); // Validation error
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Seed user before login tests
      await request(app).post('/api/v1/auth/register').send(mockUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
    });
  });
});
