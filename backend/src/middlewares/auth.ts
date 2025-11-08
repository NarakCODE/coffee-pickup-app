import type { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and adds user info to request object
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    // Verify token and extract user info
    const decoded = verifyToken(token);

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
    };

    next();
  }
);

/**
 * Optional authentication middleware
 * Adds user info to request if token is present and valid, but doesn't throw error if missing
 */
export const optionalAuthenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = {
          userId: decoded.userId,
        };
      } catch (error) {
        // Ignore token errors for optional authentication
        // User will remain undefined in req.user
      }
    }

    next();
  }
);