import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * POST /api/auth/register/initiate
 * Initiate registration by sending OTP to email
 */
router.post('/register/initiate', authController.initiateRegistration);

/**
 * POST /api/auth/register/verify
 * Complete registration with OTP verification
 */
router.post('/register/verify', authController.verifyRegistration);

/**
 * POST /api/auth/register
 * Register a new user (legacy endpoint without OTP)
 * @deprecated Use /register/initiate and /register/verify instead
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login user with email and password
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/forgot-password
 * Initiate password reset by sending OTP to email
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password with OTP verification
 */
router.post('/reset-password', authController.resetPassword);

/**
 * POST /api/auth/resend-otp
 * Resend OTP code for registration or password reset
 */
router.post('/resend-otp', authController.resendOtp);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Requires authentication
 */
router.get('/me', authenticate, authController.getMe);

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * POST /api/auth/logout
 * Logout user by revoking refresh token
 */
router.post('/logout', authController.logout);

export default router;
