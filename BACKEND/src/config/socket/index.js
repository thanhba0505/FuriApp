const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Handle interact event
    socket.on("interact", (data) => {
      console.log("interact event received:", data);
      io.emit("updatePost", data);
    });

    // Handle comment event
    socket.on("comment", (data) => {
      console.log("Comment event received:", data);
      io.emit("updatePost", data);
    });
  });
  return io;
};

module.exports = setupSocket;
