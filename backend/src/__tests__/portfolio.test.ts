import request from 'supertest';
import app from '../../app';
import { User } from '../../modules/auth/models/User';
import { Portfolio } from '../../modules/resume/models/Portfolio';

describe('Portfolio Endpoints', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    // Create test user and get token
    const testUser = {
      firstName: 'Portfolio',
      lastName: 'User',
      email: 'portfolio@example.com',
      password: 'password123',
      role: 'STUDENT',
    };
    
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    token = res.body.data.token;
    userId = res.body.data.user._id || res.body.data.user.id;
  });

  describe('GET /api/v1/portfolio', () => {
    it('should return 404 if portfolio does not exist', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
    });

    it('should return portfolio if it exists', async () => {
      // Create portfolio first
      await Portfolio.create({ userId, tagline: 'Test Tagline', about: 'Test About', featuredProjects: [], theme: 'light' });
      
      const res = await request(app)
        .get('/api/v1/portfolio')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.tagline).toBe('Test Tagline');
    });
  });

  describe('PUT /api/v1/portfolio', () => {
    it('should create portfolio if it does not exist on PUT', async () => {
      const payload = { tagline: 'New Tagline', about: 'New About', theme: 'dark' };
      
      const res = await request(app)
        .put('/api/v1/portfolio')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
      
      expect(res.status).toBe(200);
      expect(res.body.data.tagline).toBe('New Tagline');
      
      const dbPortfolio = await Portfolio.findOne({ userId });
      expect(dbPortfolio?.tagline).toBe('New Tagline');
    });

    it('should update portfolio if it exists', async () => {
      await Portfolio.create({ userId, tagline: 'Test Tagline', about: 'Test About', featuredProjects: [], theme: 'light' });
      
      const payload = { tagline: 'Updated Tagline', about: 'Updated About', theme: 'dark' };
      
      const res = await request(app)
        .put('/api/v1/portfolio')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
      
      expect(res.status).toBe(200);
      expect(res.body.data.tagline).toBe('Updated Tagline');
    });
  });
});
