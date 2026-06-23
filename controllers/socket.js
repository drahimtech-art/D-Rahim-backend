const { Server } = require("socket.io");
const userValidation = require("jsonwebtoken");
const contactMessages = require("../modules/contactMessage");

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
    const doesChatExist = await contactMessages.find({
      connectionId: connectionId,
      contactId: contactId,
    });
    if (doesChatExist.length === 0) {
      const createChatData = new contactMessages({
        connectionId: connectionId,
        contactId: contactId,
        messages: [message],
      });
      const saveData = await createChatData.save();
      if (saveData) {
        console.log("Chat history created succesfull");
      } else {
        console.log("Chat history creation failed");
      }
    } else {
      const oldMessages = doesChatExist[0].messages;
      const newMessages = [...oldMessages, message];
      const updateChat = await contactMessages.findOneAndUpdate(
        { connectionId: connectionId, contactId: contactId },
        { messages: newMessages },
      );
      if (updateChat) {
        console.log("messages succesfull saved in chat history");
      } else {
        console.log("messages falied to save in chat history");
      }
    }
  } catch (error) {
    console.log(`server error: ${error}`);
  }
}
//
async function saveForConatactChatToDB(connectionId, contactId, message) {
  try {
    const doesChatExist = await contactMessages.find({
      connectionId: contactId,
      contactId: connectionId,
    });
    if (doesChatExist.length === 0) {
      const createChatData = new contactMessages({
        connectionId: contactId,
        contactId: connectionId,
        messages: [message],
      });
      const saveData = await createChatData.save();
      if (saveData) {
        console.log("Chat history created succesfull");
      } else {
        console.log("Chat history creation failed");
      }
    } else {
      const oldMessages = doesChatExist[0].messages;
      const newMessages = [...oldMessages, message];
      const updateChat = await contactMessages.findOneAndUpdate(
        { connectionId: contactId, contactId: connectionId },
        { messages: newMessages },
      );
      if (updateChat) {
        console.log("messages succesfull saved in chat history");
      } else {
        console.log("messages falied to save in chat history");
      }
    }
  } catch (error) {
    console.log(`server error: ${error}`);
  }
}
//
async function SocketConnection(serverPort) {
  const io = new Server(serverPort, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
      credentials: true,
    },
  });
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
}
module.exports = SocketConnection;
