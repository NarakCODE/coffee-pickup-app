import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import * as productController from '../controllers/productController.js';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);
router.get('/:categoryId/products', productController.getProductsByCategory);

export default router;
