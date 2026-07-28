import { Router } from 'express';
import { register, login, refresh, logout, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';
import { protect } from '../../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limiter for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 5, // 5 requests per IP
  message: 'Too many requests, please try again after 1 minute',
  skip: () => process.env.NODE_ENV === 'test', // Disable during tests
});

// Public Routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', authLimiter, refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected Routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
