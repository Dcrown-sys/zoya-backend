const vendorModel = require("../models/vendorModel");
const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  category: z.string().min(1),
});

async function signup(req, res) {
  try {
    const data = signupSchema.parse(req.body);
    const vendor = await vendorModel.createVendor(data);
    res.status(201).json({ message: "Vendor signed up successfully", vendor });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }
    console.error("❌ Vendor signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getVendors(req, res) {
  try {
    const vendors = await vendorModel.getAllVendors();
    res.json({ vendors });
  } catch (err) {
    console.error("❌ Get vendors error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { signup, getVendors };
