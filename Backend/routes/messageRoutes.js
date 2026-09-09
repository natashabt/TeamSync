const express = require("express");

const {
  sendMessage,
  getRoomMessages,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Send Message
router.post("/rooms/:roomId/messages", protect, sendMessage);

// Get Room Messages
router.get("/rooms/:roomId/messages", protect, getRoomMessages);

module.exports = router;