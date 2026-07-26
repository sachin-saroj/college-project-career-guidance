import { Request, Response, NextFunction } from 'express';
import { aiManagerService } from '../services/aiManager.service';

export class AIController {
  
  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await aiManagerService.createSession(req.user!.userId, req.body.title);
      res.status(201).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await aiManagerService.getSessions(req.user!.userId);
      res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
      next(error);
    }
  };

  getSessionHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await aiManagerService.getSessionHistory(req.user!.userId, req.params.sessionId);
      res.status(200).json({ status: 'success', data: messages });
    } catch (error) {
      next(error);
    }
  };

  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ status: 'fail', message: 'sessionId and message are required' });
      }

      const response = await aiManagerService.processUserMessage(req.user!.userId, sessionId, message);
      
      res.status(200).json({ status: 'success', data: response });
    } catch (error) {
      next(error);
    }
  };
}

export const aiController = new AIController();
