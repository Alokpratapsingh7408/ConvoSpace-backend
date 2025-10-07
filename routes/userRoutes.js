import express from 'express';
import {
  sendOTP,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
  updateOnlineStatus,
  logout,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes (no auth required)
router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);

// Protected routes (auth required)
router.get('/user/profile', authenticate, getUserProfile);
router.put('/user/profile', authenticate, updateUserProfile);
router.put('/user/status', authenticate, updateOnlineStatus);
router.post('/auth/logout', authenticate, logout);

export default router;