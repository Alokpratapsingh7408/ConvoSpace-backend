import jwt from 'jsonwebtoken';
import { User, Session } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session is valid
    const session = await Session.findOne({
      where: { token, is_valid: true },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });
    }

    // Check if session has expired
    if (new Date() > new Date(session.expires_at)) {
      session.is_valid = false;
      await session.save();

      return res.status(401).json({
        success: false,
        error: 'Session has expired',
      });
    }

    // Get user
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive',
      });
    }

    // Update last activity
    session.last_activity_at = new Date();
    await session.save();

    // Attach user to request
    req.user = {
      id: user.id,
      phone_number: user.phone_number,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};
