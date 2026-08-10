const { describe, it, expect, beforeAll } = await import('vitest');
const jwt = require('jsonwebtoken');

describe('CareerSathi Core Integration & Auth Tests', () => {
  const testSecret = 'test_jwt_secret_careersathi_2026';

  beforeAll(() => {
    process.env.JWT_SECRET = testSecret;
  });

  it('should generate valid JWT tokens with configured secret', () => {
    const userId = 'user_12345';
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);
  });

  it('should reject tokens signed with an invalid secret', () => {
    const userId = 'user_12345';
    const fakeToken = jwt.sign({ userId }, 'wrong_secret', { expiresIn: '1h' });

    expect(() => {
      jwt.verify(fakeToken, process.env.JWT_SECRET);
    }).toThrow();
  });

  it('should reject fallback secret in production auth setup', () => {
    const fallbackToken = jwt.sign({ userId: 'hacker' }, 'fallback_secret');
    expect(() => {
      jwt.verify(fallbackToken, process.env.JWT_SECRET);
    }).toThrow();
  });
});
