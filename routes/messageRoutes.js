import express from 'express';
import { getChatHistory, sendMessage, updateStatus } from '../controllers/messageController.js';

const router = express.Router();

// Get chat history
router.get('/messages/:userId', getChatHistory);

// Send a message
router.post('/messages/send', sendMessage);

// Update user status
router.post('/status/update', updateStatus);

export default router;