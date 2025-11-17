import { Router } from 'express';
import * as storeController from '../controllers/storeController.js';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

// Admin-only routes - Create store
router.post(
  '/',
  authenticate,
  authorize({ roles: ['admin'] }),
  storeController.createStore
);

/**
 * GET /api/stores/admin/all
 * Get all stores including inactive ones (Admin only)
 */
router.get(
  '/admin/all',
  authenticate,
  authorize({ roles: ['admin'] }),
  storeController.getAllStoresAdmin
);

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
 * GET /api/stores/:storeId/gallery
 * Get store gallery images
 */
router.get('/:storeId/gallery', storeController.getStoreGallery);

/**
 * GET /api/stores/:storeId/hours
 * Get store opening hours and special hours
 */
router.get('/:storeId/hours', storeController.getStoreHours);

/**
 * GET /api/stores/:storeId/location
 * Get store location details
 */
router.get('/:storeId/location', storeController.getStoreLocation);

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

// Admin-only routes - Update, Delete, Toggle Status
/**
 * PUT /api/stores/:id
 * Update store details (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize({ roles: ['admin'] }),
  storeController.updateStore
);

/**
 * DELETE /api/stores/:id
 * Delete store (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize({ roles: ['admin'] }),
  storeController.deleteStore
);

/**
 * PATCH /api/stores/:id/status
 * Toggle store active status (Admin only)
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize({ roles: ['admin'] }),
  storeController.toggleStoreStatus
);

export default router;
