import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 * @param userId - The user ID to encode in the token
 * @returns JWT token string
 */
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  if (!secret) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }

  // Use any to bypass TypeScript strict typing for jwt options
  const options: any = { expiresIn };
  return jwt.sign({ userId }, secret, options);
};

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded payload containing userId
 * @throws AppError if token is invalid or expired
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token has expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError('Token verification failed', 401);
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1] || null;
};