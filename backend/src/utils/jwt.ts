import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET as jwt.Secret, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET as jwt.Secret, {
    expiresIn: '7d', // 7 days
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET as jwt.Secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};
