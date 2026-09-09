/*const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to TeamSync:", socket.id);

  const roomId = "6aa032c51cd889b13ec525e3";

  // Join room
  socket.emit("joinRoom", roomId);

  console.log("Joined room:", roomId);

  // Send test message
  socket.emit("sendMessage", {
    roomId: roomId,
    sender: "Test User",
    text: "Hello from Socket.IO!",
  });
});

socket.on("receiveMessage", (data) => {
  console.log("New message received:");
  console.log(data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});*/

/*const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to TeamSync:", socket.id);

  const roomId = "6aa032c51cd889b13ec525e3";

  // IMPORTANT:
  // Yahan apne logged-in room member ka actual User ID lagao.
  const senderId = "6aa032c51cd889b13ec525e3";

  // Join room
  socket.emit("joinRoom", roomId);

  console.log("Joined room:", roomId);

  // Send message
  socket.emit("sendMessage", {
    roomId: roomId,
    sender: senderId,
    text: "Hello from Socket.IO!",
  });
});

socket.on("receiveMessage", (data) => {
  console.log("New message received:");
  console.log(data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});*/


const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");

const Message = require("./models/Message");
const Room = require("./models/Room");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// ========================================
// SOCKET.IO
// ========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
  res.send("TeamSync Backend is Running!");
});

// ========================================
// API ROUTES
// ========================================

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);
app.use("/api", messageRoutes);

// ========================================
// SOCKET.IO
// ========================================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ========================================
  // JOIN ROOM
  // ========================================

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(
      `Socket ${socket.id} joined room ${roomId}`
    );
  });

  // ========================================
  // USER ONLINE
  // ========================================

  socket.on("userOnline", (data) => {
    try {
      const { roomId, userId, userName } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit("userOnline", {
        userId,
        userName,
      });

      console.log(
        `${userName} is online in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Online status error:",
        error.message
      );
    }
  });

  // ========================================
  // USER OFFLINE
  // ========================================

  socket.on("userOffline", (data) => {
    try {
      const { roomId, userId, userName } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit("userOffline", {
        userId,
        userName,
      });

      console.log(
        `${userName} is offline in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Offline status error:",
        error.message
      );
    }
  });

  // ========================================
  // TYPING
  // ========================================

  socket.on("typing", (data) => {
    try {
      const { roomId, userName } = data;

      if (!roomId || !userName) {
        return;
      }

      socket.to(roomId).emit("userTyping", {
        userName,
      });

      console.log(
        `${userName} is typing in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Typing error:",
        error.message
      );
    }
  });

  // ========================================
  // STOP TYPING
  // ========================================

  socket.on("stopTyping", (data) => {
    try {
      const { roomId } = data;

      if (!roomId) {
        return;
      }

      socket.to(roomId).emit(
        "userStoppedTyping"
      );

      console.log(
        `User stopped typing in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Stop typing error:",
        error.message
      );
    }
  });

  // ========================================
  // SEND MESSAGE
  // ========================================

  socket.on("sendMessage", async (data) => {
    try {
      const { roomId, sender, text } = data;

      if (!roomId || !sender || !text) {
        return;
      }

      // Check room
      const room = await Room.findById(roomId);

      if (!room) {
        console.log("Room not found");
        return;
      }

      // Check membership
      const isMember = room.members.some(
        (memberId) =>
          memberId.toString() ===
          sender.toString()
      );

      if (!isMember) {
        console.log(
          "User is not a member of this room"
        );
        return;
      }

      // Save message
      const message = await Message.create({
        sender,
        room: roomId,
        text,
      });

      // Populate sender
      const populatedMessage =
        await Message.findById(
          message._id
        ).populate(
          "sender",
          "name email"
        );

      // Stop typing
      socket.to(roomId).emit(
        "userStoppedTyping"
      );

      // Send message to room
      io.to(roomId).emit(
        "receiveMessage",
        populatedMessage
      );

      console.log(
        "Message saved and emitted"
      );
    } catch (error) {
      console.error(
        "Socket message error:",
        error.message
      );
    }
  });

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

// ========================================
// START SERVER
// ========================================

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});