import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  mockPaymentComplete,
} from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// POST /payments/:orderId/intent - Create payment intent
router.post('/:orderId/intent', createPaymentIntent);

// POST /payments/:orderId/confirm - Confirm payment
router.post('/:orderId/confirm', confirmPayment);

// POST /payments/mock/:orderId/complete - Mock payment completion (development only)
router.post('/mock/:orderId/complete', mockPaymentComplete);

export default router;
