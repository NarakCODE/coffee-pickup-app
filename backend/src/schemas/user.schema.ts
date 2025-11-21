import { z } from 'zod';
import {
  emailSchema,
  phoneSchema,
  userIdParamSchema,
} from './common.schema.js';

/**
 * User validation schemas
 */

/**
 * Gender enum
 */
const genderEnum = z.enum(['male', 'female', 'other']);

/**
 * User preferences schema
 */
const userPreferencesSchema = z.object({
  notificationsEnabled: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  language: z.enum(['en', 'km']).default('en'),
  currency: z.enum(['USD', 'KHR']).default('USD'),
});

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name cannot be empty')
      .max(100, 'Full name must be 100 characters or less')
      .optional(),
    email: emailSchema.optional(),
    phoneNumber: phoneSchema.optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: genderEnum.optional(),
    preferences: userPreferencesSchema.partial().optional(),
  }),
});

/**
 * Schema for user ID param
 */
export const userParamSchema = userIdParamSchema;

/**
 * Schema for updating user status (admin only)
 */
export const updateUserStatusSchema = z.object({
  params: userIdParamSchema.shape.params,
  body: z.object({
    status: z.enum(['active', 'suspended']),
  }),
});

/**
 * Schema for user list query parameters (admin only)
 */
export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    status: z.enum(['active', 'suspended', 'deleted']).optional(),
    role: z.enum(['user', 'admin', 'moderator']).optional(),
    search: z.string().trim().optional(),
  }),
});

/**
 * Type inference
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type UserParams = z.infer<typeof userParamSchema>['params'];
export type UpdateUserStatusInput = z.infer<
  typeof updateUserStatusSchema
>['body'];
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
