const sequelize = require('../config/database');
const Product = require('./product');
const Brand = require('./brand');
const Category = require('./category');
const User = require('./user');

// Associations
Brand.hasMany(Product, { foreignKey: 'brand_id' });
Product.belongsTo(Brand, { foreignKey: 'brand_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  Product,
  Brand,
  Category,
  User
};
