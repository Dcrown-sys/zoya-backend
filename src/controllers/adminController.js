const adminModel = require("../models/adminModel");
const waitlistModel = require("../models/waitlistModel");
const vendorModel = require("../models/vendorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const adminFirebase = require("../firebaseAdmin"); // Firebase Admin SDK

// ------------------------
// Nodemailer setup for SendGrid
// ------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // TLS, false for 587
  auth: {
    user: "apikey", // Must literally be "apikey"
    pass: process.env.SENDGRID_API_KEY 
  },
});

// Helper: send email
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Zoya" <zoyaprocurementcompany@gmail.com>`, // Change to your verified SendGrid sender
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
}

// Helper: send push notifications via Firebase
async function sendPushNotification(tokens, title, body) {
  if (!tokens || tokens.length === 0) return;
  try {
    await adminFirebase.messaging().sendMulticast({
      notification: { title, body },
      tokens,
    });
  } catch (err) {
    console.error("❌ Push notification error:", err);
  }
}

// ------------------------
// Admin Signup
// ------------------------
async function signup(req, res) {
  try {
    const { email, password } = req.body;

    const existing = await adminModel.findByEmail(email);
    if (existing)
      return res.status(400).json({ error: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await adminModel.createAdmin({ email, password: hashed });

    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    console.error("❌ Admin signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ------------------------
// Admin Login
// ------------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findByEmail(email);

    if (!admin)
      return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ------------------------
// Admin Analytics
// ------------------------
async function getAnalytics(req, res) {
  try {
    const totalUsers = await waitlistModel.countUsers();
    const totalVendors = await vendorModel.countVendors();
    const waitlistSignups = await waitlistModel.countWaitlist();
    const recentUsers = await waitlistModel.getRecentSignups(10);

    res.json({
      ok: true,
      analytics: { totalUsers, totalVendors, waitlistSignups, recentUsers },
    });
  } catch (err) {
    console.error("❌ Admin analytics error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

// ------------------------
// List Users / Vendors
// ------------------------
async function getAllUsers(req, res) {
  try {
    const users = await waitlistModel.getAllSignups();
    res.json({ ok: true, users });
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

async function getAllVendors(req, res) {
  try {
    const vendors = await vendorModel.getVendors();
    res.json({ ok: true, vendors });
  } catch (err) {
    console.error("❌ Fetch vendors error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

// ------------------------
// Notify Users / Vendors
// ------------------------
async function notifyUsers(req, res) {
  try {
    const { title, message } = req.body;
    const users = await waitlistModel.getAllSignups();
    const tokens = users.map((u) => u.fcmToken).filter(Boolean);

    for (const user of users) {
      await sendEmail(user.email, title, `<p>${message}</p>`);
    }

    await sendPushNotification(tokens, title, message);

    res.json({ ok: true, message: "Notifications sent to users" });
  } catch (err) {
    console.error("❌ Notify users error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

async function notifyVendors(req, res) {
  try {
    const { title, message } = req.body;
    const vendors = await vendorModel.getVendors();
    const tokens = vendors.map((v) => v.fcmToken).filter(Boolean);

    for (const vendor of vendors) {
      await sendEmail(vendor.email, title, `<p>${message}</p>`);
    }

    await sendPushNotification(tokens, title, message);

    res.json({ ok: true, message: "Notifications sent to vendors" });
  } catch (err) {
    console.error("❌ Notify vendors error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

// ------------------------
// Export
// ------------------------
module.exports = {
  signup,
  login,
  getAnalytics,
  getAllUsers,
  getAllVendors,
  notifyUsers,
  notifyVendors,
};
