require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// 🔹 1. Import all route files
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const chatRoutes = require("./routes/chatRoutes"); // Added to fix Chatbot 404

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Matches your frontend port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database Connection
connectDB();

// Real-time Logic for Inbox/Chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their chat room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Pass io to Express so controllers can emit real-time events
app.set("socketio", io);

// 🔹 2. Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/chat", chatRoutes); // Fixed: This mounts the ask-ai endpoint

app.get("/", (req, res) => {
  res.send("Backend running with AI, Socket.io, and Luxe Real Estate support");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});