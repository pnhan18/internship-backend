const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../database/mysql.database").getInstance().sequelize;
const User = require("./User.model");
const Post = require("./Post.model");

const Report = sequelize.define("Report", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  post_id: { type: DataTypes.BIGINT, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: "report", timestamps: false });

Report.belongsTo(User, { foreignKey: "user_id"});
Report.belongsTo(Post, { foreignKey: "post_id"});

module.exports = Report;
