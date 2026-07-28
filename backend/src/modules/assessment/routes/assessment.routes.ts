import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// All assessment routes require authentication
router.use(protect);

router.post('/start', assessmentController.start);
router.get('/questions', assessmentController.getQuestions);
router.patch('/answer', assessmentController.saveProgress);
router.post('/submit', assessmentController.submitAssessment);
router.get('/result', assessmentController.getResult);

export default router;
