import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Extend Express Request to include authenticated user ID
 */
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header and attaches userId to request
 * @throws UnauthorizedError if token is missing or invalid
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Access denied. No token provided or invalid format.'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }

    // Verify token and extract userId
    const decoded = verifyAccessToken(token);

    // Attach userId to request object for use in controllers
    req.userId = decoded.userId;

    next();
  }
);
