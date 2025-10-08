import jwt from 'jsonwebtoken';
import { User, OtpVerification, Session, LoginHistory } from '../models/index.js';
import { Op } from 'sequelize';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (phone-only authentication)
export const sendOTP = async (req, res) => {
  const { phone_number, otp_type } = req.body;

  try {
    // Generate OTP
    const otp_code = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const otpRecord = await OtpVerification.create({
      phone_number,
      otp_code,
      otp_type: otp_type || 'login',
      expires_at,
    });

    // Log OTP to console (for development)
    console.log('='.repeat(50));
    console.log(`📱 OTP for ${phone_number}: ${otp_code}`);
    console.log(`⏰ Expires at: ${expires_at}`);
    console.log('='.repeat(50));

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (check server console)',
      data: {
        phone_number,
        expires_at,
      },
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
};

// Verify OTP and register/login user
export const verifyOTP = async (req, res) => {
  const { phone_number, otp_code, full_name, username } = req.body;
  const ip_address = req.ip;
  const user_agent = req.get('user-agent');

  try {
    // Find valid OTP
    const otpRecord = await OtpVerification.findOne({
      where: {
        phone_number,
        otp_code,
        is_verified: false,
        is_used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['created_at', 'DESC']],
    });

    if (!otpRecord) {
      // Log failed attempt
      await LoginHistory.create({
        user_id: null,
        login_method: 'otp',
        ip_address,
        user_agent,
        is_successful: false,
        failure_reason: 'Invalid or expired OTP',
      });

      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP',
      });
    }

    // Update OTP record
    otpRecord.is_verified = true;
    otpRecord.is_used = true;
    otpRecord.verified_at = new Date();
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ where: { phone_number } });
    
    if (!user) {
      // Register new user
      user = await User.create({
        phone_number,
        full_name: full_name || null,
        username: username || null,
        is_phone_verified: true,
        is_active: true,
      });
    } else {
      // Update existing user
      user.is_phone_verified = true;
      if (full_name) user.full_name = full_name;
      if (username && !user.username) user.username = username;
      await user.save();
    }

    // Generate JWT tokens
    const token = jwt.sign(
      { id: user.id, phone_number: user.phone_number },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refresh_token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Create session
    const session = await Session.create({
      user_id: user.id,
      token,
      refresh_token,
      ip_address,
      user_agent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      last_activity_at: new Date(),
    });

    // Log successful login
    await LoginHistory.create({
      user_id: user.id,
      login_method: 'otp',
      ip_address,
      user_agent,
      is_successful: true,
    });

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user.id,
          phone_number: user.phone_number,
          full_name: user.full_name,
          username: user.username,
          profile_picture: user.profile_picture,
        },
        token,
        refresh_token,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { full_name, username, profile_picture } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken',
        });
      }
    }

    // Update user
    if (full_name) user.full_name = full_name;
    if (username) user.username = username;
    if (profile_picture) user.profile_picture = profile_picture;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

// Update online status
export const updateOnlineStatus = async (req, res) => {
  const { is_online } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.is_online = is_online;
    if (!is_online) {
      user.last_seen_at = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        is_online: user.is_online,
        last_seen_at: user.last_seen_at,
      },
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await Session.update(
        { is_valid: false },
        { where: { token } }
      );
    }

    // Update user online status
    await User.update(
      { is_online: false, last_seen_at: new Date() },
      { where: { id: req.user.id } }
    );

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ success: false, error: 'Failed to logout' });
  }
};

// Get all users (public endpoint - no authentication required)
export const getAllUsers = async (req, res) => {
  try {
    const { limit = 50, offset = 0, search } = req.query;

    const whereClause = search
      ? {
          [Op.or]: [
            { phone_number: { [Op.like]: `%${search}%` } },
            { username: { [Op.like]: `%${search}%` } },
            { full_name: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        'id',
        'phone_number',
        'username',
        'full_name',
        'profile_picture',
        'is_online',
        'last_seen_at',
        'created_at',
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalCount = await User.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + users.length < totalCount,
        },
      },
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};