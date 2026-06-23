const { Server } = require("socket.io");
const userValidation = require("jsonwebtoken");

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
        console.log(`room ${room}`);
        socket.join(room);
      });
      socket.on("send-message", (messages, room) => {
        console.log(messages, room);
      });
    } catch (error) {
      console.log(error);
    }
  });
}
module.exports = SocketConnection;
