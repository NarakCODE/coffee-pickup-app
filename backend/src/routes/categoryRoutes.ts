import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);
router.get('/:categoryId/products', productController.getProductsByCategory);

// Admin routes
router.patch(
  '/reorder',
  authenticate,
  authorize({ roles: ['admin'] }),
  categoryController.reorderCategories
);

export default router;
