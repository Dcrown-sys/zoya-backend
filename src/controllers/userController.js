const userModel = require("../models/userModel");
const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

async function signup(req, res) {
  try {
    const data = signupSchema.parse(req.body);
    const user = await userModel.createUser(data);
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { signup, getUsers };
