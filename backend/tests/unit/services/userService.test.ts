import { describe, it, expect, beforeEach } from 'vitest';
import * as userService from '../../../src/services/userService.js';
import { createTestUser, createTestAdmin } from '../../utils/testHelpers.js';

describe('UserService', () => {
  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const user = await createTestUser();

      const profile = await userService.getUserProfile(user.id);

      expect(profile).toBeDefined();
      expect(profile.email).toBe(user.email);
      expect(profile.fullName).toBe(user.fullName);
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.getUserProfile('507f1f77bcf86cd799439011')
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      const user = await createTestUser();

      const updated = await userService.updateUserProfile(user.id, {
        fullName: 'Updated Name',
      });

      expect(updated.fullName).toBe('Updated Name');
    });

    it('should not update email', async () => {
      const user = await createTestUser();

      const updated = await userService.updateUserProfile(user.id, {
        email: 'newemail@example.com',
      } as any);

      expect(updated.email).toBe(user.email); // Email should not change
    });
  });

  describe('getAllUsers', () => {
    beforeEach(async () => {
      await createTestUser({ email: 'user1@example.com' });
      await createTestUser({ email: 'user2@example.com' });
      await createTestUser({ email: 'user3@example.com' });
    });

    it('should return paginated users', async () => {
      const result = await userService.getAllUsers({}, { page: 1, limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(2);
    });

    it('should filter by status', async () => {
      await createTestUser({
        email: 'suspended@example.com',
        status: 'suspended',
      });

      const result = await userService.getAllUsers({ status: 'active' });

      expect(result.data.every((u) => u.status === 'active')).toBe(true);
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      const user = await createTestUser();

      const updated = await userService.updateUserStatus(user.id, 'suspended');

      expect(updated.status).toBe('suspended');
    });

    it('should throw error for invalid status', async () => {
      const user = await createTestUser();

      await expect(
        userService.updateUserStatus(user.id, 'invalid' as any)
      ).rejects.toThrow();
    });
  });
});
