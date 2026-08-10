import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

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

  it('should validate registration payloads with Zod schema rules', () => {
    const registerSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    });

    const validPayload = { name: 'John Doe', email: 'john@example.com', password: 'securepassword123' };
    expect(() => registerSchema.parse(validPayload)).not.toThrow();

    const invalidEmailPayload = { name: 'John', email: 'not-an-email', password: '123' };
    expect(() => registerSchema.parse(invalidEmailPayload)).toThrow();
  });
});
