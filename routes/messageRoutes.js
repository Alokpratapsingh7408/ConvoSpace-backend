import express from 'express';
import {
  sendMessage,
  getMessages,
  updateMessageStatus,
  editMessage,
  deleteMessage,
  markAllAsRead,
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/messages/send', authenticate, sendMessage);
router.get('/messages/:conversation_id', authenticate, getMessages);
router.put('/messages/:message_id/status', authenticate, updateMessageStatus);
router.put('/messages/:message_id/edit', authenticate, editMessage);
router.delete('/messages/:message_id', authenticate, deleteMessage);
router.post('/messages/:conversation_id/mark-read', authenticate, markAllAsRead);

export default router;