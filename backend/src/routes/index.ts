import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import healthRoutes from './health.routes';
import profileRoutes from '../modules/student/routes/profile.routes';
import dashboardRoutes from '../modules/student/routes/dashboard.routes';
import assessmentRoutes from '../modules/assessment/routes/assessment.routes';
import recommendationRoutes from '../modules/career/routes/recommendation.routes';
import aiRoutes from '../modules/ai/routes/ai.routes';
import resourceRoutes from '../modules/resources/routes/resource.routes';
import resumeRoutes from '../modules/resume/routes/resume.routes';
import portfolioRoutes from '../modules/resume/routes/portfolio.routes';
import adminRoutes from '../modules/admin/routes/admin.routes';

const router = Router();

// Infrastructure Routes
router.use('/health', healthRoutes);

// Feature Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/ai', aiRoutes);
router.use('/resources', resourceRoutes);
router.use('/resume', resumeRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/admin', adminRoutes);

// Placeholders for future modules
// router.use('/users', userRoutes);
// router.use('/quiz', quizRoutes);
// router.use('/recommendations', recommendationsRoutes);
// router.use('/courses', coursesRoutes);
// router.use('/scholarships', scholarshipsRoutes);
// router.use('/internships', internshipsRoutes);
// router.use('/resume', resumeRoutes);
// router.use('/chat', chatRoutes);
// router.use('/admin', adminRoutes);
// router.use('/analytics', analyticsRoutes);

export default router;
