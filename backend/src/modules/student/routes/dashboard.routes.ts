import { Router } from 'express';
import { protect } from '../../../middlewares/auth.middleware';
import { getDashboard } from '../controllers/profile.controller';

const router = Router();

router.use(protect);

router.get('/', getDashboard);

export default router;
