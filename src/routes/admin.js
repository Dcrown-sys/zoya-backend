const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/auth");

// ------------------------
// Auth
// ------------------------
router.post("/signup", adminController.signup);
router.post("/login", adminController.login);

// ------------------------
// Analytics & dashboards
// ------------------------
router.get("/analytics", authenticateAdmin, adminController.getAnalytics);
router.get("/users", authenticateAdmin, adminController.getAllUsers);
router.get("/vendors", authenticateAdmin, adminController.getAllVendors);

// ------------------------
// Notifications
// ------------------------
router.post("/notify/users", authenticateAdmin, adminController.notifyUsers);
router.post("/notify/vendors", authenticateAdmin, adminController.notifyVendors);

module.exports = router;
