import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as cartController from '../controllers/cartController.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// Get cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/items', cartController.addItem);

// Update cart item quantity
router.patch('/items/:itemId', cartController.updateItemQuantity);

// Remove item from cart
router.delete('/items/:itemId', cartController.removeItem);

// Clear cart
router.delete('/', cartController.clearCart);

// Validate cart
router.post('/validate', cartController.validateCart);

// Set delivery address
router.patch('/address', cartController.setDeliveryAddress);

// Set cart notes
router.patch('/notes', cartController.setNotes);

// Get cart summary
router.get('/summary', cartController.getCartSummary);

export default router;
