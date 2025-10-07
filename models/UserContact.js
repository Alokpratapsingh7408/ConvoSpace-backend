import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const UserContact = sequelize.define('UserContact', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  contact_user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  contact_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  is_blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  added_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'user_contacts',
  timestamps: false,
});
