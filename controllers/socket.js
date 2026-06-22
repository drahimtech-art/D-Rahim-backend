const { Server } = require("socket.io");
async function SocketConnection(serverPort) {
  const io = new Server(serverPort, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
    },
  });
  //
  io.on("connection", (socket) => {
    console.log(socket.id);
  });
}
module.exports = SocketConnection;
