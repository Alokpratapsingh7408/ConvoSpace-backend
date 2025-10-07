import express from 'express';
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
  archiveConversation,
  muteConversation,
} from '../controllers/conversationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/conversations', authenticate, getOrCreateConversation);
router.get('/conversations', authenticate, getUserConversations);
router.get('/conversations/:conversation_id', authenticate, getConversationById);
router.delete('/conversations/:conversation_id', authenticate, deleteConversation);
router.post('/conversations/:conversation_id/archive', authenticate, archiveConversation);
router.put('/conversations/:conversation_id/mute', authenticate, muteConversation);

export default router;
