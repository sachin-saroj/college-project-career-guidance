import { Router } from 'express';
import { protect } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { updateProfileSchema } from '../validators/profile.validator';
import { upload } from '../services/upload.service';
import { 
  getMyProfile, 
  updateMyProfile, 
  getProfileCompletion,
  uploadAvatar,
  deleteAvatar
} from '../controllers/profile.controller';

const router = Router();

// All profile routes require authentication
router.use(protect);

router.get('/', getMyProfile);
router.patch('/', validate(updateProfileSchema), updateMyProfile);

router.get('/completion', getProfileCompletion);

// File Uploads
router.post('/photo', upload.single('avatar'), uploadAvatar);
router.delete('/photo', deleteAvatar);

export default router;
