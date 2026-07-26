import { Request, Response, NextFunction } from 'express';
import { assessmentService } from '../services/assessment.service';
import { AssessmentResult } from '../models/AssessmentResult';

export class AssessmentController {
  
  start = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await assessmentService.startAssessment(req.user!.userId);
      res.status(200).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  };

  getQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await assessmentService.getQuestions(page, limit);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Partially saves assessment answers
   */
  saveProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await assessmentService.saveAnswers(req.user!.userId, req.body.answers);
      res.status(200).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Submits the assessment and calculates results
   */
  submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await assessmentService.submitAssessment(req.user!.userId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gets user's latest assessment result
   */
  getResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AssessmentResult.findOne({ userId: req.user!.userId }).populate('sessionId');
      if (!result) {
        return res.status(404).json({ status: 'fail', message: 'No assessment result found.' });
      }
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };
}

export const assessmentController = new AssessmentController();
