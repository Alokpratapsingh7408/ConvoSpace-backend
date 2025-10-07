import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_one_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_two_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  last_message_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_one_id', 'user_two_id'], name: 'idx_conversations_users' },
  ],
});
