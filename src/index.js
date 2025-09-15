const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const sql = require("./db");
const admin = require("./firebaseAdmin"); 

// Routes
const waitlistRoutes = require("./routes/waitlist"); 
const vendorRoutes = require("./routes/vendors");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Register routes
app.use("/waitlist", waitlistRoutes);
app.use("/vendors", vendorRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Zoya backend is running...");
});

// Example Firebase Admin route: verify ID token
app.post("/verify-token", async (req, res) => {
  const idToken = req.body.token;

  if (!idToken) return res.status(400).json({ error: "No token provided" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decodedToken.uid, email: decodedToken.email });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// DB connection test
(async () => {
  try {
    await sql`SELECT 1`;
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
