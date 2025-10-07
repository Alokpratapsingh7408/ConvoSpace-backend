import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const ConversationParticipant = sequelize.define('ConversationParticipant', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  unread_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_read_message_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  last_read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_muted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  joined_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'conversation_participants',
  timestamps: false,
});
