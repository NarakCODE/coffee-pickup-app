import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrderTracking,
  getOrderInvoice,
  cancelOrder,
  rateOrder,
  reorder,
  getOrderReceipt,
  addInternalNotes,
  updateOrderStatus,
  assignDriver,
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

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

// Admin-only order routes
router.get(
  '/:orderId/receipt',
  authorize({ roles: ['admin'] }),
  getOrderReceipt
);
router.post(
  '/:orderId/notes',
  authorize({ roles: ['admin'] }),
  addInternalNotes
);
router.patch(
  '/:orderId/status',
  authorize({ roles: ['admin'] }),
  updateOrderStatus
);
router.patch('/:orderId/assign', authorize({ roles: ['admin'] }), assignDriver);

export default router;
