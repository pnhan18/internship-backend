const { Sequelize } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;

// Import models
const Post = require("./Post")(sequelize);
const Category = require("./Category")(sequelize);

// Thiết lập quan hệ
Category.hasMany(Post, { foreignKey: "category_id", as: "posts" });
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });

const db = { sequelize, Sequelize, Post, Category };

module.exports = db;
