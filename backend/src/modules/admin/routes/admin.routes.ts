import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AdminCMSController } from '../controllers/admin.cms.controller';
import { protect, restrictTo } from '../../../middlewares/auth.middleware';
import { UserRole } from '../../auth/models/User';

const router = Router();

// All admin routes require ADMIN role
router.use(protect, restrictTo(UserRole.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

// Dashboard & Stats
router.get('/stats', AdminController.getStats);
router.get('/analytics', AdminController.getAnalytics);
router.get('/system-health', AdminController.getSystemHealth);

// Users Management
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);
router.patch('/users/:id/status', AdminController.updateUserStatus);

// Resource Management (General)
router.get('/resources', AdminController.getResources);
router.patch('/resources/:id/status', AdminController.updateResourceStatus);

// Settings & Audit
router.get('/settings', AdminController.getSettings);
router.patch('/settings', AdminController.updateSettings);
router.get('/audit-logs', AdminController.getAuditLogs);

// CMS CRUD
router.post('/cms/:type', AdminCMSController.createResource);
router.put('/cms/:type/:id', AdminCMSController.updateResource);
router.delete('/cms/:type/:id', AdminCMSController.deleteResource);

export default router;
