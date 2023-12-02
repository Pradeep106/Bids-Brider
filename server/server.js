const express = require("express");
const app = express();
const http = require("http");
const dbConnection = require("./config/dbConnection");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { Server } = require("socket.io");
const server = http.createServer(app);

require("dotenv").config();

const authRoute = require("./routes/AuthRoute");
const productRoute = require("./routes/productRoute");
const paymentRoute = require("./routes/Payment");

// dotenv config
const PORT = process.env.PORT || 4002;

// middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(errorMiddleware);
app.use(express.json());
app.use("/api/v1", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/payment", paymentRoute);

//sockket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("data", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

dbConnection();

server.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});

// Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
