const { Sequelize, DataTypes } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
const Post = require('./Post.model'); // Import model Post
const User = require('./User.model');

const Favorite = sequelize.define("Favorite", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  post_id: { type: DataTypes.BIGINT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { 
  tableName: "favorites", 
  timestamps: false 
});
Favorite.belongsTo(Post, { foreignKey: "post_id"});
Favorite.belongsTo(User, { foreignKey: "user_id"});
module.exports = Favorite;
