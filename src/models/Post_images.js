const { Sequelize, DataTypes } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
const Post = require('./Post');

const PostImage = sequelize.define(
    "PostImage",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      post_id: { type: DataTypes.BIGINT, allowNull: false },
      image_url: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    },
    { tableName: "post_images", timestamps: false }
);
  
Post.hasMany(PostImage, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  as: "images", // Alias đúng để match với truy vấn
});
PostImage.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
  
module.exports = PostImage;