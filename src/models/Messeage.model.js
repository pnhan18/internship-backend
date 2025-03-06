const { Sequelize, DataTypes } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    sender_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "sent"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { tableName: "messages", timestamps: false });
module.exports = Message;
