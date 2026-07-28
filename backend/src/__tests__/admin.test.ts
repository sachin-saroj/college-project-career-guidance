import request from 'supertest';
import app from '../app';
import { User } from '../modules/auth/models/User';

describe('Admin Endpoints', () => {
  let adminToken: string;
  let studentToken: string;

  beforeEach(async () => {
    // Create admin user
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
    };
    const resAdmin = await request(app).post('/api/v1/auth/register').send(adminUser);
    adminToken = resAdmin.body.data.token;
    
    // Some routes might actually require an explicit update to ADMIN if registration forces STUDENT,
    // but assuming our endpoint respects the role for testing or we force it:
    await User.updateOne({ email: adminUser.email }, { role: 'ADMIN' });

    // Create student user
    const studentUser = {
      firstName: 'Student',
      lastName: 'User',
      email: 'student@example.com',
      password: 'password123',
      role: 'STUDENT',
    };
    const resStudent = await request(app).post('/api/v1/auth/register').send(studentUser);
    studentToken = resStudent.body.data.token;
  });

  describe('GET /api/v1/admin/stats', () => {
    it('should return 403 for non-admin user', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
    });

    it('should return stats for admin user', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return paginated users for admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeGreaterThanOrEqual(2);
    });
  });
});
