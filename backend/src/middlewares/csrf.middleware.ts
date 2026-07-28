import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ENV } from '../config/env';
import { AppError } from '../utils/AppError';

// 1. Generate CSRF token and set it in a cookie readable by frontend JS
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies['XSRF-TOKEN'];
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // Required so frontend can read it and send it in header
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  next();
};

// 2. Validate CSRF token on state-changing requests
export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Safe methods don't need CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  if (ENV.NODE_ENV === 'test') {
    return next();
  }

  const cookieToken = req.cookies['XSRF-TOKEN'];
  const headerToken = req.header('X-XSRF-TOKEN');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new AppError('Invalid or missing CSRF token', 403));
  }

  next();
};
