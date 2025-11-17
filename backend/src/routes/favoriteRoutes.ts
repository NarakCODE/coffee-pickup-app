import { Router } from 'express';
import * as favoriteController from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * All favorite routes require authentication
 */

/**
 * GET /api/favorites
 * Get all favorites for authenticated user
 * Returns products with current price and availability
 */
router.get('/', authenticate, favoriteController.getFavorites);

/**
 * POST /api/favorites/:productId
 * Add a product to favorites
 * Handles duplicate gracefully
 */
router.post('/:productId', authenticate, favoriteController.addFavorite);

/**
 * DELETE /api/favorites/:productId
 * Remove a product from favorites
 */
router.delete('/:productId', authenticate, favoriteController.removeFavorite);

export default router;
