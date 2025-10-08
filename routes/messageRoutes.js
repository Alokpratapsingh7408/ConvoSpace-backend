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

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message operations
 */

/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - receiver_id
 *               - message_text
 *             properties:
 *               conversation_id:
 *                 type: integer
 *                 example: 1
 *               receiver_id:
 *                 type: integer
 *                 example: 2
 *               message_text:
 *                 type: string
 *                 example: "Hello!"
 *               message_type:
 *                 type: string
 *                 enum: [text, image, file, audio, video, location]
 *                 default: text
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               file_name:
 *                 type: string
 *               file_size:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.post('/messages/send', authenticate, sendMessage);

/**
 * @swagger
 * /messages/{conversation_id}:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of messages to skip
 *     responses:
 *       200:
 *         description: List of messages
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
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.get('/messages/:conversation_id', authenticate, getMessages);

/**
 * @swagger
 * /messages/{message_id}/status:
 *   put:
 *     summary: Update message status (delivered/read)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [delivered, read]
 *                 example: "read"
 *     responses:
 *       200:
 *         description: Message status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.put('/messages/:message_id/status', authenticate, updateMessageStatus);

/**
 * @swagger
 * /messages/{message_id}/edit:
 *   put:
 *     summary: Edit a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message_text
 *             properties:
 *               message_text:
 *                 type: string
 *                 example: "Updated message"
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.put('/messages/:message_id/edit', authenticate, editMessage);

/**
 * @swagger
 * /messages/{message_id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.delete('/messages/:message_id', authenticate, deleteMessage);

/**
 * @swagger
 * /messages/{conversation_id}/mark-read:
 *   post:
 *     summary: Mark all messages in a conversation as read
 *     tags: [Messages]
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
 *         description: All messages marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.post('/messages/:conversation_id/mark-read', authenticate, markAllAsRead);

export default router;