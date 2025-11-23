import { describe, it, expect, beforeEach } from 'vitest';
import * as authService from '../../../src/services/authService.js';
import { User } from '../../../src/models/User.js';
import { createTestUser } from '../../utils/testHelpers.js';

describe('AuthService', () => {
  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await createTestUser({
import { describe, it, expect, beforeEach } from 'vitest';
import * as authService from '../../../src/services/authService.js';
import { User } from '../../../src/models/User.js';
import { RefreshToken } from '../../../src/models/RefreshToken.js';
import { createTestUser } from '../../utils/testHelpers.js';

describe('AuthService', () => {
  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await createTestUser({
        email: 'test@example.com',
        password: 'Test123!',
      });
    });

    it('should login user with valid credentials', async () => {
      const result = await authService.loginUser(
        {
          email: 'test@example.com',
          password: 'Test123!',
        },
        {
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent'
        }
      );

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });

    it('should throw error with invalid email', async () => {
      await expect(
        authService.loginUser(
          {
            email: 'wrong@example.com',
            password: 'Test123!',
          },
          {
            ipAddress: '127.0.0.1',
            userAgent: 'test-agent'
          }
        )
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with invalid password', async () => {
      await expect(
        authService.loginUser(
          {
            email: 'test@example.com',
            password: 'WrongPassword',
          },
          {
            ipAddress: '127.0.0.1',
            userAgent: 'test-agent'
          }
        )
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'NewUser123!',
        fullName: 'New User',
      };

      const result = await authService.registerUser(userData);

      expect(result).toHaveProperty('accessToken'); // registerUser returns tokens too
      expect(result.user).toHaveProperty('email', 'newuser@example.com');

      const user = await User.findById(result.user.id);
      expect(user).toBeDefined();
      expect(user?.email).toBe('newuser@example.com');
    });

    it('should throw error if email already exists', async () => {
      await createTestUser({ email: 'existing@example.com' });

      await expect(
        authService.registerUser({
          email: 'existing@example.com',
          password: 'Test123!',
          fullName: 'Test User',
        })
      ).rejects.toThrow('Email is already registered');
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'secure@example.com',
        password: 'SecurePass123!',
        fullName: 'Secure User',
      };

      const result = await authService.registerUser(userData);
      const user = await User.findById(result.user.id);

      expect(user?.password).not.toBe('SecurePass123!');
      expect(user?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const user = await createTestUser({
        email: 'logout@example.com',
        password: 'Password123!',
      });

      const loginResult = await authService.loginUser(
        {
          email: 'logout@example.com',
          password: 'Password123!',
        },
        {
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent'
        }
      );

      const result = await authService.logoutUser(loginResult.refreshToken);
      expect(result).toHaveProperty('message', 'Logged out successfully');

      const tokenInDb = await RefreshToken.findOne({ token: loginResult.refreshToken });
      expect(tokenInDb).toBeNull();
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(authService.logoutUser('invalid-token')).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Login to get valid tokens
      const user = await createTestUser({
        email: 'refresh@example.com',
        password: 'Password123!',
      });
      const loginResult = await authService.loginUser(
        {
          email: 'refresh@example.com',
          password: 'Password123!',
        },
        {
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent'
        }
      );

      const result = await authService.refreshAccessToken(loginResult.refreshToken);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(authService.refreshAccessToken('invalid-token')).rejects.toThrow('Invalid refresh token');
    });
  });
});
