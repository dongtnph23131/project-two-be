const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const newMessage = {
      sender: req.user._id,
      content: content,
      chatId,
    };

    let message = await Message.create(newMessage);
    message = await message.populate("sender", "-password");
    message = await message.populate("chatId");
    message = await User.populate(message, {
      path: "chatId.users",
      select: "-password",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(400).json({
      messsage: error.messsage,
    });
  }
};

exports.getMessageByChatId = async (req, res) => {
  try {
    let messages = await Message.find({ chatId: req.params.id })
      .populate("sender", "-password")
      .populate("chatId");
    messages = await User.populate(messages, {
      path: "chatId.users",
      select: "-password",
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
