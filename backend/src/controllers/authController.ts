import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';
import { BadRequestError } from '../utils/AppError.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new BadRequestError('Name, email, and password are required');
    }

    // Register user
    const result = await authService.registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      data: result,
    });
  }
);

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    // Login user
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // userId is attached by auth middleware
    if (!req.userId) {
      throw new BadRequestError('User ID not found in request');
    }

    const user = await authService.getUserById(req.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);
