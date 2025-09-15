const express = require("express");
const router = express.Router();
const { signupWaitlist } = require("../controllers/waitlistController");

// POST /waitlist/signup
router.post("/signup", signupWaitlist);

module.exports = router;
