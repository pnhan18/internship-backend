const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../database/mysql.database").getInstance().sequelize;
const Category = require('./Category.model');
const User = require('./User.model')
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
    status: { type: DataTypes.ENUM("active", "pending", "block","sold","rejected"), allowNull: false, defaultValue: "pending" },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW  },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  { tableName: "posts", timestamps: false }
);
Post.belongsTo(Category, { foreignKey: 'category_id' });
Post.belongsTo(User, {foreignKey: "user_id"});

module.exports = Post;