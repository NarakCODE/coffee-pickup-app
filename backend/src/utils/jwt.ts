import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

interface TokenPayload {
  userId: string;
}

interface RefreshTokenPayload extends TokenPayload {
  tokenId: string;
}

/**
 * Generate JWT access token for a user
 * @param userId - User ID to encode in token
 * @returns JWT access token string
 */
export const generateAccessToken = (userId: string): string => {
  const payload: TokenPayload = { userId };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token for a user
 * @param userId - User ID to encode in token
 * @param _deviceInfo - Device information for tracking (reserved for future use)
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (
  userId: string,
  _deviceInfo: string
): string => {
  const tokenId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const payload: RefreshTokenPayload = { userId, tokenId };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verify and decode JWT access token
 * @param token - JWT token to verify
 * @returns Decoded token payload with userId
 * @throws UnauthorizedError if token is invalid or expired
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

/**
 * Verify and decode JWT refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload with userId and tokenId
 * @throws UnauthorizedError if token is invalid or expired
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET
    ) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw new UnauthorizedError('Refresh token verification failed');
  }
};
