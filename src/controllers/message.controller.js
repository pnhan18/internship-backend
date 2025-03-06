const MessageService = require("../services/messageService");

class MessageController {
    // Gửi tin nhắn
    static async sendMessage(req, res) {
        try {
            const message = await MessageService.sendMessage(req.body);
            res.status(201).json({ success: true, message });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Lấy tin nhắn giữa hai người dùng
    static async getMessages(req, res) {
        try {
            const { user1, user2 } = req.params;
            const messages = await MessageService.getMessages(user1, user2);
            res.status(200).json({ success: true, messages });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Lấy danh sách hội thoại của một user
    static async getConversations(req, res) {
        try {
            const { userId } = req.params;
            const conversations = await MessageService.getConversations(userId);
            res.status(200).json({ success: true, conversations });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = MessageController;
