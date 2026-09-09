const Message = require("../models/Message");
const Room = require("../models/Room");

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Message text is required",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this room",
      });
    }

    const message = await Message.create({
      sender: req.user.userId,
      room: roomId,
      text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Get Room Messages
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this room",
      });
    }

    const messages = await Message.find({ room: roomId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getRoomMessages,
};