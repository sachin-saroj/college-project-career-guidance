import { Request, Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendation.service';

export class RecommendationController {
  
  getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recommendations = await recommendationService.getRecommendations(req.user!.userId);
      res.status(200).json({ status: 'success', data: recommendations });
    } catch (error) {
      next(error);
    }
  };

  getCareerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = await recommendationService.getRecommendationDetails(req.user!.userId, req.params.careerId);
      res.status(200).json({ status: 'success', data: details });
    } catch (error) {
      next(error);
    }
  };
}

export const recommendationController = new RecommendationController();
