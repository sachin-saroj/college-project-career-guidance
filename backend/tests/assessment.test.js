import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('10-Question Diagnostic Engine Verification', () => {
  let authToken = '';
  const testEmail = `assessment_test_${Date.now()}@example.com`;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Priya Diagnostic Test',
        email: testEmail,
        password: 'Password123!'
      });
    authToken = res.body.token;
  });

  it('GET /api/assessment returns exactly 10 questions with valid structure', async () => {
    const res = await request(app)
      .get('/api/assessment')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('questions');
    expect(res.body.questions).toHaveLength(10);

    res.body.questions.forEach((q, idx) => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('type');
      expect(q).toHaveProperty('text');
      expect(q).toHaveProperty('options');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('POST /api/assessment/submit computes complete, rich diagnostic output with 0 blank fields', async () => {
    const mockAnswers = [
      "Deep individual focus — breaking problems down independently in quiet flow",
      "Strongly Agree",
      "Building interactive software, web apps, or automating repetitive tasks with scripts",
      "Agree",
      "Rigorous quantitative evidence, data benchmarks, and empirical test results",
      "Agree",
      "Scalable Cloud Architecture, DevOps automation, and Cyber Security defenses",
      "Agree",
      "Attaining deep technical craft mastery and recognized domain engineering excellence",
      "Strongly Agree"
    ];

    const res = await request(app)
      .post('/api/assessment/submit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ answers: mockAnswers });

    expect(res.status).toBe(200);
    const data = res.body;

    // Verify all primary fields are present and non-empty
    expect(data.topMatch).toBeDefined();
    expect(typeof data.topMatch).toBe('string');
    expect(data.topMatch.length).toBeGreaterThan(0);

    expect(typeof data.matchScore).toBe('number');
    expect(data.matchScore).toBeGreaterThanOrEqual(85);
    expect(data.matchScore).toBeLessThanOrEqual(100);

    expect(data.archetype).toBeDefined();
    expect(data.summary).toBeDefined();
    expect(data.summary.length).toBeGreaterThan(15);
    expect(data.salaryRange).toBeDefined();
    expect(data.marketDemand).toBeDefined();

    // Verify skills and growth areas
    expect(Array.isArray(data.skills)).toBe(true);
    expect(data.skills.length).toBeGreaterThanOrEqual(3);

    expect(Array.isArray(data.growthAreas)).toBe(true);
    expect(data.growthAreas.length).toBeGreaterThanOrEqual(2);

    // Verify 5-stage milestone roadmap
    expect(Array.isArray(data.roadmap)).toBe(true);
    expect(data.roadmap.length).toBe(5);
    data.roadmap.forEach((milestone, idx) => {
      expect(milestone).toHaveProperty('step', idx + 1);
      expect(milestone).toHaveProperty('title');
      expect(milestone).toHaveProperty('duration');
      expect(milestone).toHaveProperty('description');
      expect(milestone).toHaveProperty('actionItems');
    });

    // Verify 6-trait Radar data
    expect(Array.isArray(data.radarData)).toBe(true);
    expect(data.radarData.length).toBe(6);
    const subjects = data.radarData.map(r => r.subject);
    expect(subjects).toContain('Logic');
    expect(subjects).toContain('Creativity');
    expect(subjects).toContain('Communication');
    expect(subjects).toContain('Quantitative');
    expect(subjects).toContain('Leadership');
    expect(subjects).toContain('Resilience');

    data.radarData.forEach(r => {
      expect(typeof r.A).toBe('number');
      expect(r.A).toBeGreaterThanOrEqual(50);
      expect(r.A).toBeLessThanOrEqual(100);
    });

    // Verify 2 alternative career matches
    expect(Array.isArray(data.alternativeMatches)).toBe(true);
    expect(data.alternativeMatches.length).toBe(2);
    data.alternativeMatches.forEach(alt => {
      expect(alt).toHaveProperty('title');
      expect(alt).toHaveProperty('matchScore');
      expect(alt).toHaveProperty('archetype');
      expect(alt).toHaveProperty('salaryRange');
      expect(alt).toHaveProperty('reason');
    });
  });

  it('persists assessment completion and recommendations to user profile and dashboard', async () => {
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.assessmentCompleted).toBe(true);
    expect(meRes.body.lastRecommendations).toBeDefined();
    expect(meRes.body.lastRecommendations.topMatch).toBeDefined();

    const dashRes = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(dashRes.status).toBe(200);
    expect(dashRes.body.recommendations).toBeDefined();
    expect(dashRes.body.recommendations.topMatch).toBe(meRes.body.lastRecommendations.topMatch);
  });
});
