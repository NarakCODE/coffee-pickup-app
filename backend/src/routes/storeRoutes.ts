import { Router } from 'express';
import * as storeController from '../controllers/storeController.js';
import * as productController from '../controllers/productController.js';

const router = Router();

/**
 * GET /api/stores
 * Get all active stores
 * Query params:
 * - latitude: User's latitude (optional)
 * - longitude: User's longitude (optional)
 * - radius: Search radius in kilometers (optional)
 */
router.get('/', storeController.getAllStores);

/**
 * GET /api/stores/slug/:slug
 * Get store by slug
 */
router.get('/slug/:slug', storeController.getStoreBySlug);

/**
 * GET /api/stores/:id
 * Get store by ID
 */
router.get('/:id', storeController.getStoreById);

/**
 * GET /api/stores/:id/pickup-times
 * Get available pickup times for a store
 * Query params:
 * - date: Target date in ISO format (optional, defaults to today)
 */
router.get('/:id/pickup-times', storeController.getPickupTimes);

/**
 * GET /api/stores/:storeId/menu
 * Get menu (products) for a specific store
 * Query params:
 * - categoryId: Filter by category (optional)
 * - isFeatured: Filter featured products (optional)
 * - isBestSelling: Filter best selling products (optional)
 * - tags: Filter by tags (optional)
 * - minPrice: Minimum price filter (optional)
 * - maxPrice: Maximum price filter (optional)
 */
router.get('/:storeId/menu', productController.getStoreMenu);

export default router;
