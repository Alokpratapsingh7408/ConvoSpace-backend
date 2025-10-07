import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  message_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  message_type: {
    type: DataTypes.STRING(20),
    defaultValue: 'text',
    comment: 'text, image, file, audio, video, location',
  },
  media_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  file_size: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['conversation_id', 'created_at'], name: 'idx_messages_conversation' },
  ],
});