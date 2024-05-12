const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const messageRouter = require("./routers/message");
const { uri_Client } = require("./config/uri-client");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", userRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1", messageRouter);
const serverCreate = require("http").createServer(app);
const server = serverCreate.listen(8080, async () => {
  await mongoose.connect(
    "mongodb+srv://donghaha:123456abc@ecommerce.ylijltl.mongodb.net/project-two-be?retryWrites=true"
  );
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: `${uri_Client()}`,
  },
});
io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (newMessage) => {
    let chat = newMessage.chatId;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });
});
