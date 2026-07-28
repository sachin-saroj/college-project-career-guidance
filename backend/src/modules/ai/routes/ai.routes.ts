import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// All AI routes require authentication
router.use(protect);

router.post('/session', aiController.createSession);
router.get('/history', aiController.getHistory);
router.get('/session/:sessionId', aiController.getSessionHistory);
router.post('/chat', aiController.chat);

export default router;
