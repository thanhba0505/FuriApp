const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http");

const route = require("./routes");
const database = require("./config/database");

dotenv.config();

const app = express();
const port = 5174;

// connect database
database.connect();

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const setupSocket = require("./config/socket");
const io = setupSocket(server);

// Make the socket instance available in the app
app.set("socketio", io);

// public
app.use("/public/app", express.static(path.join(__dirname, "/public/app")));

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FURI_FRONTEND_BASE_URL,
    credentials: true,
  })
);
app.use(morgan("common"));

// Route
route(app, io);

// Start server with HTTP server
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
