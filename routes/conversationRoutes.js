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

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Conversation management
 */

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Get or create a conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *             properties:
 *               participant_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Conversation retrieved or created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/conversations', authenticate, getOrCreateConversation);

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get all user conversations
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations', authenticate, getUserConversations);

/**
 * @swagger
 * /conversations/{conversation_id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.get('/conversations/:conversation_id', authenticate, getConversationById);

/**
 * @swagger
 * /conversations/{conversation_id}:
 *   delete:
 *     summary: Delete conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.delete('/conversations/:conversation_id', authenticate, deleteConversation);

/**
 * @swagger
 * /conversations/{conversation_id}/archive:
 *   post:
 *     summary: Archive conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation archived successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.post('/conversations/:conversation_id/archive', authenticate, archiveConversation);

/**
 * @swagger
 * /conversations/{conversation_id}/mute:
 *   put:
 *     summary: Mute or unmute conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_muted
 *             properties:
 *               is_muted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Conversation mute status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.put('/conversations/:conversation_id/mute', authenticate, muteConversation);

export default router;
