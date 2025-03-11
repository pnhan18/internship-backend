const { Sequelize, DataTypes } = require("sequelize");
const Database = require('../database/mysql.database');
const User = require("./User.model");
const Post = require("./Post.model");

const sequelize = Database.getInstance().sequelize;

const Message = sequelize.define("Message", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    senderId: {
        type: DataTypes.BIGINT,
        field: "sender_id",
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    receiverId: {
        type: DataTypes.BIGINT,
        field: "receiver_id",
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    postId: {
        type: DataTypes.BIGINT,
        field: "post_id",
        references: {
            model: Post,
            key: "id"
        }
    },
    content: {
        type: DataTypes.TEXT,
        field: "content",
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("sent", "received", "seen"),
        field: "status",
        defaultValue: "sent"
    },
    createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
    },
}, { 
    tableName: "messages", 
    timestamps: false 
});

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });
Message.belongsTo(Post, { foreignKey: "postId", as: "post" });

module.exports = Message;
