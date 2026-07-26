import { Request, Response, NextFunction } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { portfolioSchema, updatePortfolioSchema } from '../validators/portfolio.validator';

export class PortfolioController {
  static async getPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any)._id;
      let portfolio = await PortfolioService.getPortfolioByUserId(userId);
      
      // If portfolio doesn't exist, we can either return 404 or a null data.
      // Usually, UI wants a 200 with data or a specific format.
      // Resume mock returned portfolio object.
      if (!portfolio) {
        return res.status(404).json({
          status: 'error',
          message: 'Portfolio not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: portfolio
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any)._id;
      
      const { error, value } = portfolioSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const portfolio = await PortfolioService.createPortfolio(userId, value);

      res.status(201).json({
        status: 'success',
        data: portfolio
      });
    } catch (error: any) {
      if (error.message === 'Portfolio already exists for this user') {
        return res.status(409).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  }

  static async updatePortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any)._id;
      
      const { error, value } = updatePortfolioSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: error.details[0].message
        });
      }

      const portfolio = await PortfolioService.updatePortfolio(userId, value);

      if (!portfolio) {
        return res.status(404).json({
          status: 'error',
          message: 'Portfolio not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: portfolio
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any)._id;
      
      const deleted = await PortfolioService.deletePortfolio(userId);

      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Portfolio not found'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Portfolio deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
