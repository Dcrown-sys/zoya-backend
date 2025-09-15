const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Waitlist signup
router.post("/signup", userController.signup);

// List all users (admin only later)
router.get("/", userController.getUsers);

module.exports = router;
