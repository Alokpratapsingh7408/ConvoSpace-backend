import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  refresh_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
    unique: true,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  last_activity_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['token'], name: 'idx_sessions_token' },
  ],
});
