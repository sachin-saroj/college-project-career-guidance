import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { protect } from '../../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limiter for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // 5 requests per IP
  message: 'Too many login attempts, please try again after 15 minutes',
});

// Public Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);

// Protected Routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
