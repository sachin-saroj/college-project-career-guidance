import { Router } from 'express';
import { searchResources, getRecommendedResources, getBookmarks, addBookmark, removeBookmark } from '../controllers/resource.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

/**
 * @route GET /api/v1/resources/search
 * @desc Global text search across courses, scholarships, internships, articles
 * @access Public
 */
router.get('/search', searchResources);

/**
 * @route GET /api/v1/resources/recommended
 * @desc Get perfectly matched resources based on Phase 6 & Phase 5 profiles
 * @access Private
 */
router.get('/recommended', protect, getRecommendedResources);

/**
 * @route GET /api/v1/resources/bookmarks
 * @desc Get user's bookmarked resources
 * @access Private
 */
router.get('/bookmarks', protect, getBookmarks);

/**
 * @route POST /api/v1/resources/bookmarks
 * @desc Bookmark a resource
 * @access Private
 */
router.post('/bookmarks', protect, addBookmark);

/**
 * @route DELETE /api/v1/resources/bookmarks/:id
 * @desc Remove a bookmark by resource ID
 * @access Private
 */
router.delete('/bookmarks/:id', protect, removeBookmark);

export default router;
