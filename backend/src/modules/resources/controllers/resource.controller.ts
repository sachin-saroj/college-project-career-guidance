import { Request, Response, NextFunction } from 'express';
import { resourceService } from '../services/resource.service';

export const searchResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, type, page, limit } = req.query;
    
    if (!type) {
      return res.status(400).json({ status: 'fail', message: 'Resource type is required for search.' });
    }

    const data = await resourceService.searchResources(
      q as string,
      type as string,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10
    );

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Requires requireAuth middleware to be in place so req.user exists
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const data = await resourceService.getRecommendedResources(req.user.userId);

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any)._id || req.user?.userId;
    const bookmarks = await resourceService.getBookmarks(userId);
    // Frontend expects an array of strings in data or at least an array format
    // Map them to IDs to match frontend expectation
    const bookmarkIds = bookmarks.map(b => b.resourceId.toString());
    
    res.status(200).json({
      status: 'success',
      data: bookmarkIds
    });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any)._id || req.user?.userId;
    const { resourceId, resourceType } = req.body;
    
    if (!resourceId || !resourceType) {
      return res.status(400).json({ status: 'fail', message: 'resourceId and resourceType are required.' });
    }

    await resourceService.addBookmark(userId, resourceId, resourceType);
    
    res.status(201).json({
      status: 'success',
      message: 'Bookmark added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any)._id || req.user?.userId;
    const { id: resourceId } = req.params;
    
    await resourceService.removeBookmark(userId, resourceId);
    
    res.status(200).json({
      status: 'success',
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
