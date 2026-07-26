import { Router } from 'express';
import { 
  createResume, 
  getResumes, 
  getResumeById, 
  updateResume, 
  deleteResume, 
  calculateAtsScore, 
  exportPdf, 
  aiRewriteBullets, 
  aiGenerateSummary 
} from '../controllers/resume.controller';
import { protect } from '../../../middlewares/auth.middleware';
import { requireOwnership } from '../../../middlewares/ownership.middleware';
import { Resume } from '../models/Resume';

const router = Router();

// All resume routes require authentication
router.use(protect);

router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', requireOwnership(Resume), getResumeById);
router.put('/:id', requireOwnership(Resume), updateResume);
router.delete('/:id', requireOwnership(Resume), deleteResume);

// Engine Endpoints
router.get('/:id/ats', calculateAtsScore);
router.get('/:id/export/pdf', exportPdf);

// AI Assistance
router.post('/ai/rewrite', aiRewriteBullets);
router.post('/:id/ai/summary', aiGenerateSummary);

export default router;
