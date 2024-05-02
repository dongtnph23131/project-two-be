const Chat = require("../models/chat");

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const isChat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("lastMessage");
    if (isChat.length === 0) {
      const data = await Chat.create({ users: [req.user.id, userId] });
      return res.status(200).json(data);
    }
    return res.status(200).json(isChat[0]);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
exports.fetchChatsByUser = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("lastMessage").sort({ updateAt: -1 });
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
