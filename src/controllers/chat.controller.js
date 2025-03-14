const { OK } = require("../core/success.response");
const ChatService = require("../services/chat.service");

class ChatController {
    static async getUserConversations(req, res) {
        const userID = req.user.id;
        const conversations = await ChatService.getUserConversations(userID);
        new OK("Success", conversations).send(res);
    }
}

module.exports = ChatController;
