/*const express = require("express");
const { createUser } = require("../controllers/userController");

const router = express.Router();

router.post("/users", createUser);

module.exports = router;*/

/*const express = require("express");

const {
  createUser,
  getUsers,
} = require("../controllers/userController");

const router = express.Router();

// Create User
router.post("/users", createUser);

// Get All Users
router.get("/users", getUsers);

module.exports = router;*/

/*const express = require("express");

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

module.exports = router;*/

/*const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// Create User
router.post("/users", createUser);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

// Update User
router.put("/users/:id", updateUser);

module.exports = router;*/

/*const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Create User
router.post("/users", createUser);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

// Update User
router.put("/users/:id", updateUser);

// Delete User
router.delete("/users/:id", deleteUser);

module.exports = router;*/

/*const express = require("express");

const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Signup
router.post("/users", createUser);

// Login
router.post("/login", loginUser);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

// Update User
router.put("/users/:id", updateUser);

// Delete User
router.delete("/users/:id", deleteUser);

module.exports = router;*/

/*const express = require("express");

const {
  createUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Signup
router.post("/users", createUser);

// Login
router.post("/login", loginUser);

// Protected Profile API
router.get("/profile", protect, getProfile);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

// Update User
router.put("/users/:id", updateUser);

// Delete User
router.delete("/users/:id", deleteUser);

module.exports = router;*/

const express = require("express");

const {
  createUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Signup
router.post("/users", createUser);

// Login
router.post("/login", loginUser);

// Protected Profile API
router.get("/profile", protect, getProfile);

// Get All Users
router.get("/users", getUsers);

// Get User By ID
router.get("/users/:id", getUserById);

// Protected Update User
router.put("/users/:id", protect, updateUser);

// Protected Delete User
router.delete("/users/:id", protect, deleteUser);

module.exports = router;