import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

/**
 * Product Routes
 * Base path: /api/products
 */

// Search products (must be before /:id to avoid conflict)
router.get('/search', productController.searchProducts);

// Get product by slug (must be before /:id to avoid conflict)
router.get('/slug/:slug', productController.getProductBySlug);

// Get all products with filtering
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get product customizations
router.get('/:id/customizations', productController.getProductCustomizations);

// Get product add-ons
router.get('/:id/addons', productController.getProductAddOns);

// Admin only: Update product status
router.patch(
  '/:productId/status',
  authenticate,
  authorize({ roles: ['admin'] }),
  productController.updateProductStatus
);

// Admin only: Duplicate product
router.post(
  '/:productId/duplicate',
  authenticate,
  authorize({ roles: ['admin'] }),
  productController.duplicateProduct
);

export default router;
