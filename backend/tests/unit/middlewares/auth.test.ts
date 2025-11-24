import { describe, it, expect, vi } from 'vitest';
import { authenticate } from '../../../src/middlewares/auth.js';
import { generateAuthToken, createTestUser } from '../../utils/testHelpers.js';
import type { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  const mockRequest = (authHeader?: string) =>
    ({
      headers: {
        authorization: authHeader,
      },
    }) as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = vi.fn() as NextFunction;

  it('should authenticate with valid token', async () => {
    const user = await createTestUser();
    const token = generateAuthToken(user.id, 'user');
    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    await authenticate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.userId).toBe(user.id);
  });

  it('should reject request without token', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format', async () => {
    const req = mockRequest('InvalidFormat token123');
    const res = mockResponse();

    await authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should reject request with expired token', async () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjF9.invalid';
    const req = mockRequest(`Bearer ${expiredToken}`);
    const res = mockResponse();

    await authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
