import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  login_method: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_successful: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  failure_reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'login_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});
