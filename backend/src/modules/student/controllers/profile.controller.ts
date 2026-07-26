import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { AppError } from '../../../utils/AppError';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const data = await ProfileService.getProfileByUserId(userId);
    
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const data = await ProfileService.updateProfile(userId, req.body);
    
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProfileCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { completion } = await ProfileService.getProfileByUserId(userId);
    
    res.status(200).json({ status: 'success', data: completion });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const dashboardData = await ProfileService.getDashboardData(userId);
    
    res.status(200).json({ status: 'success', data: dashboardData });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('Please provide an image file', 400);
    }
    
    const userId = req.user!.userId;
    const data = await ProfileService.uploadAvatar(userId, req.file.buffer);
    
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const data = await ProfileService.deleteAvatar(userId);
    
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
