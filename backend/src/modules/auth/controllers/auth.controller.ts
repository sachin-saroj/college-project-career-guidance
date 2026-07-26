import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('jwt_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } = await AuthService.registerUser(req.body);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      status: 'success',
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } = await AuthService.loginUser(req.body);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      status: 'success',
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.jwt_refresh;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
    }

    const { accessToken } = await AuthService.refreshAuthToken(refreshToken);

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.userId) {
      await AuthService.logoutUser(req.user.userId);
    }
    
    res.cookie('jwt_refresh', 'loggedout', {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000), // expire in 10 sec
    });

    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('Not authenticated');
    const data = await AuthService.getCurrentUserProfile(req.user.userId);
    
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};
