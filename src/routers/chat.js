const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { fetchChatsByUser, accessChat } = require("../controllers/chat");

const router = express.Router();

router.get("/fetchs/chat-by-user", authenticate, fetchChatsByUser);
router.post("/assess-chat", authenticate, accessChat);
module.exports = router;
