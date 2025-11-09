import { Router } from 'express';
import * as productController from '../controllers/productController.js';

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

export default router;
