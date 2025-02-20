const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
  dbConfig.db.database,
  dbConfig.db.username,
  dbConfig.db.password,
  {
    host: dbConfig.db.host,
    dialect: "mysql",
  }
);

const Category = sequelize.define("Category", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "categories", timestamps: false });

module.exports = Category;
