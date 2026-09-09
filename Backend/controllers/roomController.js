const Room = require("../models/Room");

// Create Room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Room name is required",
      });
    }

    const room = await Room.create({
      name,
      createdBy: req.user.userId,
      members: [req.user.userId],
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating room",
      error: error.message,
    });
  }
};

// Get All Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};

// Join Room
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const alreadyMember = room.members.some(
      (memberId) => memberId.toString() === req.user.userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "You are already a member of this room",
      });
    }

    room.members.push(req.user.userId);

    await room.save();

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error joining room",
      error: error.message,
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  joinRoom,
};