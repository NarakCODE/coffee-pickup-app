import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  registerDevice,
  unregisterDevice,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getSettings,
  updateSettings,
} from '../controllers/notificationController.js';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Device token management
router.post('/devices/register', registerDevice);
router.delete('/devices/:tokenId', unregisterDevice);

// Notification management
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

// Notification settings
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

export default router;
