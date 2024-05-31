const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Handle like event
    socket.on("like", (data) => {
      console.log("Like event received:", data);
      io.emit("updatePost", data); // Broadcast the update to all clients
    });

    // Handle comment event
    socket.on("comment", (data) => {
      console.log("Comment event received:", data);
      io.emit("updatePost", data); // Broadcast the update to all clients
    });
  });
  return io;
};

module.exports = setupSocket;
