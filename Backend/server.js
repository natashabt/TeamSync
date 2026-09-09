/*const express = require("express");
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
const User = require("./models/User");

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5000;

// ====================
// Middleware
// ====================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ====================
// Home Route
// ====================

app.get("/", (req, res) => {
  res.send("TeamSync Backend is Running!");
});

// ====================
// API Routes
// ====================

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);
app.use("/api", messageRoutes);

// ====================
// Socket.IO
// ====================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // --------------------
  // Join Room
  // --------------------

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(
      `Socket ${socket.id} joined room ${roomId}`
    );
  });

  // --------------------
  // Typing Indicator
  // --------------------

  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("userTyping");
  });

  socket.on("stopTyping", (roomId) => {
    socket.to(roomId).emit("userStoppedTyping");
  });

  // --------------------
  // Send Message
  // --------------------

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
          memberId.toString() === sender.toString()
      );

      if (!isMember) {
        console.log(
          "User is not a member of this room"
        );
        return;
      }

      // Check sender
      const user = await User.findById(sender);

      if (!user) {
        console.log("Sender not found");
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
        await Message.findById(message._id).populate(
          "sender",
          "name email"
        );

      // Send message to everyone in room
      io.to(roomId).emit(
        "receiveMessage",
        populatedMessage
      );

      console.log("Message saved and emitted");
    } catch (error) {
      console.error(
        "Socket message error:",
        error.message
      );
    }
  });

  // --------------------
  // Disconnect
  // --------------------

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

// ====================
// Start Server
// ====================

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});*/

/*const express = require("express");
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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5000;

// ========================================
// Middleware
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ========================================
// Home
// ========================================

app.get("/", (req, res) => {
  res.send("TeamSync Backend is Running!");
});

// ========================================
// API Routes
// ========================================

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);
app.use("/api", messageRoutes);

// ========================================
// Socket.IO
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
  // TYPING START
  // ========================================

  socket.on("typing", (data) => {
    try {
      const { roomId, userName } = data;

      if (!roomId || !userName) {
        return;
      }

      // Send typing event to everyone
      // except the person who is typing
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
  // TYPING STOP
  // ========================================

  socket.on("stopTyping", (data) => {
    try {
      const { roomId } = data;

      if (!roomId) {
        return;
      }

      socket.to(roomId).emit("userStoppedTyping");

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
          memberId.toString() === sender
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
        await Message.findById(message._id)
          .populate("sender", "name email");

      // Send message to everyone in room
      io.to(roomId).emit(
        "receiveMessage",
        populatedMessage
      );

      // Stop typing after message is sent
      io.to(roomId).emit(
        "userStoppedTyping"
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
// Start Server
// ========================================

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});*/

/*const express = require("express");
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

const protect = require("./middleware/authMiddleware");

dotenv.config();

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// EXPRESS
// ========================================

const app = express();

// ========================================
// HTTP SERVER
// ========================================

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

// ========================================
// PORT
// ========================================

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
  res.json({
    message: "TeamSync Backend is Running!",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);

// ========================================
// GET MESSAGES FOR A ROOM
// ========================================
// IMPORTANT:
// Frontend is calling:
// GET /api/messages/:roomId
//
// So backend must have this exact route.

app.get(
  "/api/messages/:roomId",
  protect,
  async (req, res) => {
    try {
      const { roomId } = req.params;

      console.log(
        "Fetching messages for room:",
        roomId
      );

      // Check room
      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      // Check if user belongs to room
      const isMember = room.members.some(
        (memberId) =>
          memberId.toString() ===
          req.user.userId.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          message:
            "You are not a member of this room",
        });
      }

      // Get messages
      const messages = await Message.find({
        room: roomId,
      })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

      return res.status(200).json({
        message: "Messages fetched successfully",
        messages,
      });
    } catch (error) {
      console.error(
        "Get messages error:",
        error.message
      );

      return res.status(500).json({
        message: "Error fetching messages",
        error: error.message,
      });
    }
  }
);

// ========================================
// OTHER MESSAGE ROUTES
// ========================================

app.use("/api", messageRoutes);

// ========================================
// SOCKET.IO
// ========================================

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  // ========================================
  // JOIN ROOM
  // ========================================

  socket.on("joinRoom", (roomId) => {
    if (!roomId) {
      return;
    }

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
      const {
        roomId,
        userId,
        userName,
      } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit(
        "userOnline",
        {
          userId,
          userName,
        }
      );

      console.log(
        `${userName} is online in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "User online error:",
        error.message
      );
    }
  });

  // ========================================
  // USER OFFLINE
  // ========================================

  socket.on("userOffline", (data) => {
    try {
      const {
        roomId,
        userId,
        userName,
      } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit(
        "userOffline",
        {
          userId,
          userName,
        }
      );

      console.log(
        `${userName} is offline from room ${roomId}`
      );
    } catch (error) {
      console.error(
        "User offline error:",
        error.message
      );
    }
  });

  // ========================================
  // TYPING
  // ========================================

  socket.on("typing", (data) => {
    try {
      const {
        roomId,
        userName,
      } = data;

      if (!roomId || !userName) {
        return;
      }

      // Send only to other users
      socket.to(roomId).emit(
        "userTyping",
        {
          userName,
        }
      );

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
        `Typing stopped in room ${roomId}`
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

  socket.on(
    "sendMessage",
    async (data) => {
      try {
        const {
          roomId,
          sender,
          text,
        } = data;

        if (
          !roomId ||
          !sender ||
          !text
        ) {
          console.log(
            "Invalid message data"
          );

          return;
        }

        // ========================================
        // CHECK ROOM
        // ========================================

        const room =
          await Room.findById(roomId);

        if (!room) {
          console.log(
            "Room not found"
          );

          return;
        }

        // ========================================
        // CHECK MEMBERSHIP
        // ========================================

        const isMember =
          room.members.some(
            (memberId) =>
              memberId
                .toString() ===
              sender.toString()
          );

        if (!isMember) {
          console.log(
            "User is not a member of this room"
          );

          return;
        }

        // ========================================
        // SAVE MESSAGE
        // ========================================

        const message =
          await Message.create({
            sender,
            room: roomId,
            text: text.trim(),
          });

        // ========================================
        // POPULATE SENDER
        // ========================================

        const populatedMessage =
          await Message.findById(
            message._id
          ).populate(
            "sender",
            "name email"
          );

        // ========================================
        // EMIT MESSAGE
        // ========================================

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
    }
  );

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    }
  );
});

// ========================================
// START SERVER
// ========================================

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);*/

const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const {
  redisClient,
  connectRedis,
} = require("./config/redis");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");

const Message = require("./models/Message");
const Room = require("./models/Room");

const protect = require("./middleware/authMiddleware");

dotenv.config();

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// EXPRESS
// ========================================

const app = express();

// ========================================
// HTTP SERVER
// ========================================

const server = http.createServer(app);

// ========================================
// SOCKET.IO
// ========================================

const io = new Server(server, {
  cors: {
   origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://team-sync-black.vercel.app",
],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ========================================
// PORT
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://team-sync-black.vercel.app",
]
  })
);

app.use(express.json());

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "TeamSync Backend is Running!",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);

// ========================================
// GET ROOM MESSAGES
// ========================================

app.get(
  "/api/messages/:roomId",
  protect,
  async (req, res) => {
    try {
      const { roomId } = req.params;

      console.log(
        "Fetching messages for room:",
        roomId
      );

      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      const isMember = room.members.some(
        (memberId) =>
          memberId.toString() ===
          req.user.userId.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          message:
            "You are not a member of this room",
        });
      }

      const messages = await Message.find({
        room: roomId,
      })
        .populate("sender", "name email")
        .populate("seenBy", "name email")
        .sort({ createdAt: 1 });

      return res.status(200).json({
        message:
          "Messages fetched successfully",
        messages,
      });
    } catch (error) {
      console.error(
        "Get messages error:",
        error.message
      );

      return res.status(500).json({
        message: "Error fetching messages",
        error: error.message,
      });
    }
  }
);

// ========================================
// OTHER MESSAGE ROUTES
// ========================================

app.use("/api", messageRoutes);

// ========================================
// REDIS PUB/SUB
// ========================================

const REDIS_CHANNEL = "teamsync:messages";

const startRedisSubscriber = async () => {
  try {
    const redisSubscriber =
      redisClient.duplicate();

    redisSubscriber.on(
      "error",
      (error) => {
        console.error(
          "Redis Subscriber Error:",
          error.message
        );
      }
    );

    await redisSubscriber.connect();

    console.log(
      "Redis Subscriber connected successfully!"
    );

    await redisSubscriber.subscribe(
      REDIS_CHANNEL,
      (message) => {
        try {
          const parsedMessage =
            JSON.parse(message);

          const {
            roomId,
            messageData,
          } = parsedMessage;

          if (!roomId || !messageData) {
            return;
          }

          // Emit message to all local Socket.IO
          // clients connected to this server.
          io.to(roomId).emit(
            "receiveMessage",
            messageData
          );

          console.log(
            `Redis message received for room: ${roomId}`
          );
        } catch (error) {
          console.error(
            "Redis message parse error:",
            error.message
          );
        }
      }
    );

    return redisSubscriber;
  } catch (error) {
    console.error(
      "Redis Subscriber connection failed:",
      error.message
    );

    return null;
  }
};

// ========================================
// SOCKET.IO
// ========================================

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  // ========================================
  // JOIN ROOM
  // ========================================

  socket.on("joinRoom", (data) => {
    try {
      // Support both:
      // socket.emit("joinRoom", roomId)
      // socket.emit("joinRoom", { roomId, userId })

      const roomId =
        typeof data === "object"
          ? data.roomId
          : data;

      if (!roomId) {
        return;
      }

      socket.join(roomId);

      console.log(
        `Socket ${socket.id} joined room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Join room error:",
        error.message
      );
    }
  });

  // ========================================
  // USER ONLINE
  // ========================================

  socket.on("userOnline", (data) => {
    try {
      const {
        roomId,
        userId,
        userName,
      } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit(
        "userOnline",
        {
          userId,
          userName,
        }
      );

      console.log(
        `${userName} is online in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "User online error:",
        error.message
      );
    }
  });

  // ========================================
  // USER OFFLINE
  // ========================================

  socket.on("userOffline", (data) => {
    try {
      const {
        roomId,
        userId,
        userName,
      } = data;

      if (!roomId || !userId || !userName) {
        return;
      }

      socket.to(roomId).emit(
        "userOffline",
        {
          userId,
          userName,
        }
      );

      console.log(
        `${userName} is offline from room ${roomId}`
      );
    } catch (error) {
      console.error(
        "User offline error:",
        error.message
      );
    }
  });

  // ========================================
  // TYPING
  // ========================================

  socket.on("typing", (data) => {
    try {
      const {
        roomId,
        userName,
      } = data;

      if (!roomId || !userName) {
        return;
      }

      socket.to(roomId).emit(
        "userTyping",
        {
          userName,
        }
      );

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
        `Typing stopped in room ${roomId}`
      );
    } catch (error) {
      console.error(
        "Stop typing error:",
        error.message
      );
    }
  });

  // ========================================
  // MESSAGE SEEN
  // ========================================

  socket.on(
    "messageSeen",
    async (data) => {
      try {
        const {
          messageId,
          userId,
          roomId,
        } = data;

        if (
          !messageId ||
          !userId ||
          !roomId
        ) {
          return;
        }

        // Add user to seenBy
        await Message.findByIdAndUpdate(
          messageId,
          {
            $addToSet: {
              seenBy: userId,
            },
          }
        );

        // Get updated message
        const updatedMessage =
          await Message.findById(
            messageId
          )
            .populate(
              "sender",
              "name email"
            )
            .populate(
              "seenBy",
              "name email"
            );

        if (!updatedMessage) {
          return;
        }

        // Tell everyone in room
        io.to(roomId).emit(
          "messageSeen",
          {
            messageId,
            userId,
            seenBy:
              updatedMessage.seenBy,
          }
        );

        console.log(
          `Message ${messageId} seen by ${userId}`
        );
      } catch (error) {
        console.error(
          "Message seen error:",
          error.message
        );
      }
    }
  );

  // ========================================
  // SEND MESSAGE
  // ========================================

  socket.on(
    "sendMessage",
    async (data) => {
      try {
        const {
          roomId,
          sender,
          text,
        } = data;

        if (
          !roomId ||
          !sender ||
          !text
        ) {
          console.log(
            "Invalid message data"
          );

          return;
        }

        // ========================================
        // CHECK ROOM
        // ========================================

        const room =
          await Room.findById(roomId);

        if (!room) {
          console.log(
            "Room not found"
          );

          return;
        }

        // ========================================
        // CHECK MEMBERSHIP
        // ========================================

        const isMember =
          room.members.some(
            (memberId) =>
              memberId
                .toString() ===
              sender.toString()
          );

        if (!isMember) {
          console.log(
            "User is not a member of this room"
          );

          return;
        }

        // ========================================
        // SAVE MESSAGE
        // ========================================

        const message =
          await Message.create({
            sender,
            room: roomId,
            text: text.trim(),
            seenBy: [],
          });

        // ========================================
        // POPULATE MESSAGE
        // ========================================

        const populatedMessage =
          await Message.findById(
            message._id
          )
            .populate(
              "sender",
              "name email"
            )
            .populate(
              "seenBy",
              "name email"
            );

        // ========================================
        // REDIS PUB/SUB
        // ========================================

        const redisPayload =
          JSON.stringify({
            roomId,
            messageData:
              populatedMessage,
          });

        await redisClient.publish(
          REDIS_CHANNEL,
          redisPayload
        );

        console.log(
          "Message published to Redis"
        );

        console.log(
          "Message saved successfully"
        );
      } catch (error) {
        console.error(
          "Socket message error:",
          error.message
        );
      }
    }
  );

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    }
  );
});

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    // Connect Redis Publisher
    await connectRedis();

    // Create Redis Subscriber
    await startRedisSubscriber();

    server.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup error:",
      error.message
    );
  }
};

startServer();