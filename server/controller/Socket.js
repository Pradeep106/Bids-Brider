// socket.js
const socketIo = require("socket.io");

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your client's origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle incoming messages
    socket.on("message", (message) => {
      console.log("Received message:", message);

      // Broadcast the message to all connected clients
      io.emit("message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocket;
