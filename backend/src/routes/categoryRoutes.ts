import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);

export default router;
