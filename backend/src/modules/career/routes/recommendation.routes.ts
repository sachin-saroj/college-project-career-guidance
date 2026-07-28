import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', recommendationController.getRecommendations);
router.get('/:careerId', recommendationController.getCareerDetails);

export default router;
