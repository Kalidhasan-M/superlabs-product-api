const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false, // Set to true if you want to see SQL queries in logs
    define: {
      timestamps: true,
       freezeTableName: true
    }
  }
);

module.exports = sequelize;
