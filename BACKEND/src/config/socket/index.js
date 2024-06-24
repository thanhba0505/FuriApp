const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FURI_UI_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  return io;
};

module.exports = setupSocket;
