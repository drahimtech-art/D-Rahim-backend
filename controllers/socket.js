const { Server } = require("socket.io");
const userValidation = require("jsonwebtoken");
const contactMessages = require("../modules/contactMessage");
const getServer = require("../server");
const serverPort = getServer();
//contect to socket
const io = new Server(serverPort, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
    credentials: true,
  },
});

//middleware
async function validateUser(socket) {
  try {
    const token = socket.handshake.headers.cookie.split("=")[1];
    const isUser = userValidation.verify(token, process.env.ACCESS_TOKEN);
    if (!isUser) return socket.disconnect();
  } catch (error) {
    console.log(`server error validating user socket requst ${error}`);
  }
}
async function validateClient(socket) {
  try {
    const clientId = socket.handshake.headers["x-frontend-key"];
    if (clientId !== process.env.CLIENT_KEY) return socket.disconnect();
  } catch (error) {
    console.log(
      `server error validating which client requst socket requst ${error}`,
    );
  }
}
// save chat to db func

async function saveChatToDB(chatId, messages) {
  try {
    const addChatToList = await contactMessages.insertOne({
      groupId: chatId,
      messages: messages,
      createdAt: new Date(),
    });
    if (addChatToList) {
      console.log("Chat history created succesfull");
    } else {
      console.log("Chat history creation failed");
    }
  } catch (error) {
    console.log(`server error: ${error}`);
  }
}
//
async function sendFileEvents(messages, room) {
  if (!io) return;
  try {
    const connectionId = messages.from;
    const contactId = messages.to;
    saveChatToDB(room.chatId, messages);
    io.to(room.connection).emit("receive-message", messages);
  } catch (error) {
    console.log(error);
  }
}
//

io.on("connection", async (socket) => {
  try {
    //middleware
    await validateUser(socket);
    await validateClient(socket);
    //
    console.log(socket.id);
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    socket.on("leave-room", (room) => {
      socket.leave(room);
    });
    socket.on("isOnline", (room, senderRoom) => {
      socket.to(room).emit("areYouOnline", senderRoom);
    });
    socket.on("amOnline", (room, state) => {
      socket.to(room).emit("online", state);
    });

    socket.on("send-message", (messages, room) => {
      const connectionId = messages.from;
      const contactId = messages.to;
      saveChatToDB(room.chatId, messages);
      socket.to(room.connection).emit("receive-message", messages);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { sendFileEvents };
