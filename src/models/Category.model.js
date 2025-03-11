const { Sequelize, DataTypes } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;

const Category = sequelize.define("Category", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "categories", timestamps: false });

module.exports = Category;
