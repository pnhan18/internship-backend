const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

// Gửi tin nhắn
router.post("/messages/send", messageController.sendMessage);

// Lấy tin nhắn giữa 2 người dùng
router.get("/messages/chat/:user1/:user2", messageController.getMessages);

// Lấy danh sách hội thoại của một người dùng
router.get("/messages/conversations/:userId", messageController.getConversations);

module.exports = router;
