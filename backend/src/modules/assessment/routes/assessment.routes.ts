import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller';
import { requireAuth } from '../../auth/middlewares/requireAuth';

const router = Router();

// All assessment routes require authentication
router.use(requireAuth);

router.post('/start', assessmentController.start);
router.get('/questions', assessmentController.getQuestions);
router.patch('/answer', assessmentController.answer);
router.post('/submit', assessmentController.submit);
router.get('/result', assessmentController.getResult);

export default router;
