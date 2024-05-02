const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { sendMessage, getMessageByChatId } = require("../controllers/message");

const router = express.Router();

router.post("/send-message", authenticate, sendMessage);
router.get("/get-message-by-chat-id/:id", authenticate, getMessageByChatId);
module.exports = router;
