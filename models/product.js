const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  images: {
    type: DataTypes.JSON, // PostgreSQL supports JSONB/JSON for arrays/objects
    allowNull: true,
    defaultValue: []
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
