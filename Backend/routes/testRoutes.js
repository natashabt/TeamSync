/*const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        message: "TeamSync API is working!"
    });
});

module.exports = router;*/

const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

// Create User
router.post("/users", createUser);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

module.exports = router;