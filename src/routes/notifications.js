const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateAdmin } = require("../middleware/auth");

// Save device token
router.post("/register", notificationController.registerToken);

// Send notification to one user
router.post("/send", authenticateAdmin, notificationController.sendNotification);

// Broadcast to all users
router.post("/broadcast", authenticateAdmin, notificationController.broadcastNotification);

module.exports = router;
