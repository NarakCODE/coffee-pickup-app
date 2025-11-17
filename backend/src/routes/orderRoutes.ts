import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrderTracking,
  getOrderInvoice,
  cancelOrder,
  rateOrder,
  reorder,
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// User order routes
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.get('/:orderId/tracking', getOrderTracking);
router.get('/:orderId/invoice', getOrderInvoice);
router.post('/:orderId/cancel', cancelOrder);
router.post('/:orderId/rate', rateOrder);
router.post('/:orderId/reorder', reorder);

export default router;
