const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

// Vendor signup
router.post("/signup", vendorController.signup);

// Get all vendors
router.get("/", vendorController.getVendors);

module.exports = router;
