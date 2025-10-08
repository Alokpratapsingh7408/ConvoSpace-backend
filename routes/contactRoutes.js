import express from 'express';
import {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  blockContact,
  getBlockedContacts,
  searchContacts,
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Add a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contact_user_id
 *             properties:
 *               contact_user_id:
 *                 type: integer
 *                 example: 2
 *               contact_name:
 *                 type: string
 *                 example: "Jane Doe"
 *     responses:
 *       201:
 *         description: Contact added successfully
 *       400:
 *         description: Contact already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/contacts', authenticate, addContact);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
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
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/contacts', authenticate, getContacts);

/**
 * @swagger
 * /contacts/{contact_id}:
 *   put:
 *     summary: Update contact details
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact_name:
 *                 type: string
 *                 example: "Jane Smith"
 *               is_favorite:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.put('/contacts/:contact_id', authenticate, updateContact);

/**
 * @swagger
 * /contacts/{contact_id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.delete('/contacts/:contact_id', authenticate, deleteContact);

/**
 * @swagger
 * /contacts/{contact_id}/block:
 *   put:
 *     summary: Block or unblock a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_blocked
 *             properties:
 *               is_blocked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Contact block status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.put('/contacts/:contact_id/block', authenticate, blockContact);

/**
 * @swagger
 * /contacts/blocked:
 *   get:
 *     summary: Get all blocked contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blocked contacts
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
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/contacts/blocked', authenticate, getBlockedContacts);

/**
 * @swagger
 * /contacts/search:
 *   get:
 *     summary: Search contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: "john"
 *     responses:
 *       200:
 *         description: Search results
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
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/contacts/search', authenticate, searchContacts);

export default router;
