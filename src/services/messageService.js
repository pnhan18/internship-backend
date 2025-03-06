const Message = require("../models/Messeage.model");
const { Op } = require("sequelize");
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
class MessageService {
    // Gửi tin nhắn
    static async sendMessage({ sender_id, receiver_id, post_id, content }) {
        return await Message.create({ sender_id, receiver_id, post_id, content });
    }

    // Lấy tin nhắn giữa hai người dùng
    static async getMessages(user1, user2) {
        return await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: user1, receiver_id: user2 },
                    { sender_id: user2, receiver_id: user1 }
                ]
            },
            order: [["created_at", "ASC"]]
        });
    }

    // Lấy danh sách hội thoại của một user
    static async getConversations(userId) {
        return await sequelize.query(
            `SELECT u.id, ui.name, m.content AS last_message, m.created_at, m.sender_id AS last_sender_id
            FROM user u
            JOIN user_info ui ON u.id = ui.user_id
            JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
            WHERE u.id != :userId 
              AND (m.sender_id = :userId OR m.receiver_id = :userId)
              AND m.created_at = (
                  SELECT MAX(m2.created_at)
                  FROM messages m2
                  WHERE (m2.sender_id = u.id AND m2.receiver_id = :userId) 
                     OR (m2.sender_id = :userId AND m2.receiver_id = u.id)
              )
            ORDER BY m.created_at DESC`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );
    }
        
}

module.exports = MessageService;
