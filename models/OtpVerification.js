import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const OtpVerification = sequelize.define('OtpVerification', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  otp_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'registration, login, password_reset, phone_verification',
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'otp_verifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['phone_number'], name: 'idx_otp_phone' },
    { fields: ['otp_code'], name: 'idx_otp_code' },
  ],
});
