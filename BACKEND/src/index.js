const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const route = require("./routes");
const dotenv = require("dotenv");
const http = require("http");
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
app.use("/public/", express.static(path.join(__dirname, "/public/")));

// 
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(morgan("common"));

// route
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
