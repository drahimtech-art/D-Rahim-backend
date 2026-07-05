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
function validateUser(socket) {
  const token = socket.handshake.headers.cookie.split("=")[1];
  const isUser = userValidation.verify(token, process.env.ACCESS_TOKEN);
  if (!isUser) return socket.disconnect();
}
function validateClient(socket) {
  const clientId = socket.handshake.headers["x-frontend-key"];
  if (clientId !== process.env.CLIENT_KEY) return socket.disconnect();
}
// save chat to db func
async function saveForUserChatToDB(connectionId, contactId, message) {
  try {
    const createChatData = new contactMessages({
      connectionId: connectionId,
      contactId: contactId,
      messages: message,
      createdAt: new Date(),
    });
    const saveData = await createChatData.save();
    if (saveData) {
      console.log("Chat history created succesfull");
    } else {
      console.log("Chat history creation failed");
    }
  } catch (error) {
    console.log(`server error: ${error}`);
  }
}
//
async function saveForConatactChatToDB(connectionId, contactId, message) {
  try {
    const createChatData = new contactMessages({
      connectionId: contactId,
      contactId: connectionId,
      messages: message,
      createdAt: new Date(),
    });
    const saveData = await createChatData.save();
    if (saveData) {
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
    saveForUserChatToDB(connectionId, contactId, messages);
    saveForConatactChatToDB(connectionId, contactId, messages);
    io.to(room).emit("receive-message", messages);
  } catch (error) {
    console.log(error);
  }
}
//

io.on("connection", async (socket) => {
  try {
    //middleware
    validateUser(socket);
    validateClient(socket);
    //
    console.log(socket.id);
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    socket.on("leave-room", (room) => {
      socket.leave(room);
    });
    socket.on("send-message", (messages, room) => {
      const connectionId = messages.from;
      const contactId = messages.to;
      saveForUserChatToDB(connectionId, contactId, messages);
      saveForConatactChatToDB(connectionId, contactId, messages);
      socket.to(room).emit("receive-message", messages);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { sendFileEvents };
