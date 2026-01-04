require("dotenv").config();
const express = require("express");
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Required for Socket.io
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app); // Wrap Express app

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Adjust to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database Connection
connectDB();

// Real-time Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Users join a unique room based on their ID for private chats
  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their chat room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Pass io to Express so controllers can emit events
app.set("socketio", io);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));

app.get("/", (req, res) => {
  res.send("Backend running with Socket.io support");
});

// Listen on the 'server' object, NOT 'app'
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});