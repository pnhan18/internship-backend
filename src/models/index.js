const { Sequelize } = require("sequelize");
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

// Import models
const Post = require("./Post")(sequelize);
const Category = require("./Category")(sequelize);

// Thiết lập quan hệ
Category.hasMany(Post, { foreignKey: "category_id", as: "posts" });
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });

const db = { sequelize, Sequelize, Post, Category };

module.exports = db;
