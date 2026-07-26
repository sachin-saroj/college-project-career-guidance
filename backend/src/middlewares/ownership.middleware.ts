import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireOwnership = (Model: any, idParamKey: string = 'id', ownerField: string = 'userId') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params[idParamKey];
      if (!resourceId) {
        return next(new AppError('Resource ID is missing in request', 400));
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return next(new AppError('Resource not found', 404));
      }

      const userId = (req.user as any)._id || req.user?.id;
      
      // If user is admin, allow
      if (req.user?.role === 'ADMIN') {
        return next();
      }

      // Check ownership
      if (resource[ownerField]?.toString() !== userId?.toString()) {
        return next(new AppError('You do not have permission to modify this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
