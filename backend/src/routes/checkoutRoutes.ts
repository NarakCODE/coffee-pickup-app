import { Router } from 'express';
import {
  validateCheckout,
  createCheckoutSession,
  getCheckoutSession,
  getPaymentMethods,
  applyCoupon,
  removeCoupon,
  getDeliveryCharges,
  confirmCheckout,
} from '../controllers/checkoutController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All checkout routes require authentication
router.use(authenticate);

// POST /checkout/validate - Validate cart before checkout
router.post('/validate', validateCheckout);

// POST /checkout - Create checkout session
router.post('/', createCheckoutSession);

// GET /checkout/:checkoutId - Get checkout session details
router.get('/:checkoutId', getCheckoutSession);

// GET /checkout/payment-methods - Get available payment methods
router.get('/payment-methods', getPaymentMethods);

// POST /checkout/:checkoutId/apply-coupon - Apply coupon to checkout
router.post('/:checkoutId/apply-coupon', applyCoupon);

// DELETE /checkout/:checkoutId/remove-coupon - Remove coupon from checkout
router.delete('/:checkoutId/remove-coupon', removeCoupon);

// GET /checkout/delivery-charges - Calculate delivery charges
router.get('/delivery-charges', getDeliveryCharges);

// POST /checkout/:checkoutId/confirm - Confirm checkout and create order
router.post('/:checkoutId/confirm', confirmCheckout);

export default router;
