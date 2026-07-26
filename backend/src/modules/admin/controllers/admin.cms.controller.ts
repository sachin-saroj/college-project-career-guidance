import { Request, Response, NextFunction } from 'express';
import { AdminCMSService } from '../services/admin.cms.service';

export class AdminCMSController {
  static async createResource(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminCMSService.createResource(req.params.type, req.body);
      res.status(201).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async updateResource(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminCMSService.updateResource(req.params.type, req.params.id, req.body);
      if (!data) return res.status(404).json({ status: 'error', message: 'Resource not found' });
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  }

  static async deleteResource(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminCMSService.deleteResource(req.params.type, req.params.id);
      if (!data) return res.status(404).json({ status: 'error', message: 'Resource not found' });
      res.status(200).json({ status: 'success', message: 'Resource deleted' });
    } catch (error) { next(error); }
  }
}
