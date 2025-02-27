const { Sequelize, DataTypes } = require("sequelize");
const Category = require('./Category');
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
const Post_images = require("../models/Post_images");

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    category_id: { type: DataTypes.BIGINT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    product_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    product_status: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  },
  { tableName: "posts", timestamps: false }
);
Post.hasMany(Post_images, { foreignKey: "post_id", as: "images" })
Post.belongsTo(Category, { foreignKey: 'category_id' });
module.exports = Post;
