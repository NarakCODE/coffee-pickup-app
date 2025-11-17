import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validateUser } from '../middlewares/validateRequest.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

/**
 * ADMIN: Get all users
 */
router.get('/', authenticate, authorize({ roles: ['admin'] }), getAllUsers);

/**
 * ADMIN or SELF: Get user by ID
 */
router.get(
  '/:id',
  authenticate,
  authorize({
    roles: ['admin'],
    allowSelf: true,
    resourceOwnerParam: 'id',
  }),
  getUserById
);

/**
 * ADMIN: Create new user
 */
router.post(
  '/',
  authenticate,
  authorize({ roles: ['admin'] }),
  validateUser,
  createUser
);

/**
 * ADMIN or SELF: Update user
 */
router.put(
  '/:id',
  authenticate,
  authorize({
    roles: ['admin'],
    allowSelf: true,
    resourceOwnerParam: 'id',
  }),
  updateUser
);

/**
 * ADMIN or SELF: Delete user
 */
router.delete(
  '/:id',
  authenticate,
  authorize({
    roles: ['admin'],
    allowSelf: true,
    resourceOwnerParam: 'id',
  }),
  deleteUser
);

export default router;
