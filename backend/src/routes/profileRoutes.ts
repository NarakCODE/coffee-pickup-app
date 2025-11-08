import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  updatePassword,
  updateSettings,
  getReferralStats,
  deleteAccount,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Profile management endpoints
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/image', uploadProfileImage);
router.put('/password', updatePassword);
router.put('/settings', updateSettings);
router.get('/referral', getReferralStats);
router.delete('/', deleteAccount);

export default router;
