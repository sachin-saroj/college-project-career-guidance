import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller';
import { requireAuth } from '../../auth/middlewares/requireAuth';

const router = Router();

router.use(requireAuth);

router.get('/', recommendationController.getRecommendations);
router.get('/:careerId', recommendationController.getCareerDetails);

export default router;
