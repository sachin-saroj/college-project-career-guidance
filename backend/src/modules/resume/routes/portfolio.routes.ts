import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all portfolio routes
router.use(protect);

/**
 * @swagger
 * /portfolio:
 *   get:
 *     summary: Get user's portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', PortfolioController.getPortfolio);

/**
 * @swagger
 * /portfolio:
 *   post:
 *     summary: Create a portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', PortfolioController.createPortfolio);

/**
 * @swagger
 * /portfolio:
 *   put:
 *     summary: Update portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.put('/', PortfolioController.updatePortfolio);

/**
 * @swagger
 * /portfolio:
 *   delete:
 *     summary: Delete portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/', PortfolioController.deletePortfolio);

export default router;
