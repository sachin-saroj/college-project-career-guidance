import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStats();
      res.status(200).json({ status: 'success', data: stats });
    } catch (error) { next(error); }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const data = await AdminService.getUsers(Number(page), Number(limit), search as string);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      res.status(200).json({ status: 'success', data: user });
    } catch (error) { next(error); }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.updateUserStatus(req.params.id, req.body.status);
      res.status(200).json({ status: 'success', data: user });
    } catch (error) { next(error); }
  }

  static async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const data = await AdminService.getResources(Number(page), Number(limit), search as string);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async updateResourceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await AdminService.updateResourceStatus(req.params.id, req.body.status);
      res.status(200).json({ status: 'success', data: resource });
    } catch (error) { next(error); }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getAnalytics();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async getSystemHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getSystemHealth();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getSettings();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any)._id || (req.user as any).id;
      const data = await AdminService.updateSettings(req.body.key, req.body.value, userId);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await AdminService.getAuditLogs(Number(page), Number(limit));
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }
}
