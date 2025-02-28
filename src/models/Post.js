const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../database/mysql.database").getInstance().sequelize;

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
    status: { type: DataTypes.ENUM("active", "pending", "block"), allowNull: false, defaultValue: "active" },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW  },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  { tableName: "posts", timestamps: false }
);

module.exports = Post;