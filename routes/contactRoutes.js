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

// All routes require authentication
router.post('/contacts', authenticate, addContact);
router.get('/contacts', authenticate, getContacts);
router.put('/contacts/:contact_id', authenticate, updateContact);
router.delete('/contacts/:contact_id', authenticate, deleteContact);
router.put('/contacts/:contact_id/block', authenticate, blockContact);
router.get('/contacts/blocked', authenticate, getBlockedContacts);
router.get('/contacts/search', authenticate, searchContacts);

export default router;
