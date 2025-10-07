import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  notification_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'message, friend_request, system',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  related_entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'message, conversation, user',
  },
  related_entity_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id', 'is_read'], name: 'idx_notifications_user' },
  ],
});
