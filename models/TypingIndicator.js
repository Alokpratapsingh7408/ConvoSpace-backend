import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const TypingIndicator = sequelize.define('TypingIndicator', {
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
  is_typing: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'typing_indicators',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
});
