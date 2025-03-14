const express = require("express");
const ChatController = require("../controllers/chat.controller");
const CatchAsync = require("../utils/CatchAsync");
const { authentication } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/conversations", authentication, CatchAsync(ChatController.getUserConversations));

module.exports = router;
