import express from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/notifications', authenticate, createNotification);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:notification_id/read', authenticate, markAsRead);
router.post('/notifications/read-all', authenticate, markAllAsRead);
router.delete('/notifications/:notification_id', authenticate, deleteNotification);
router.get('/notifications/unread-count', authenticate, getUnreadCount);

export default router;
