import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Liveness probe (Kubernetes / Render)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is live' });
});

// Readiness probe (Database checks)
router.get('/ready', (req: Request, res: Response) => {
  const isMongoConnected = mongoose.connection.readyState === 1;

  if (isMongoConnected) {
    res.status(200).json({
      status: 'success',
      message: 'API is ready',
      dependencies: {
        database: 'connected',
      },
    });
  } else {
    res.status(503).json({
      status: 'error',
      message: 'API is not ready',
      dependencies: {
        database: 'disconnected',
      },
    });
  }
});

export default router;
