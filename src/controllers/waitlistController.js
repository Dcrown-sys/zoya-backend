const sql = require("../db");
const { z } = require("zod");

// Validation schema
const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  role: z.enum(["buyer", "vendor"]).default("buyer"),
});

// POST /waitlist/signup
async function signupWaitlist(req, res) {
  try {
    const data = waitlistSchema.parse(req.body);

    const inserted = await sql`
      INSERT INTO users (full_name, email, phone, role, status)
      VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.role}, 'waitlisted')
      ON CONFLICT (email) DO UPDATE 
        SET full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role
      RETURNING id, full_name, email, phone, role, status, created_at;
    `;

    res.status(201).json({
      ok: true,
      message: "Signed up for waitlist successfully",
      user: inserted[0],
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ ok: false, error: err.errors });
    }
    console.error("Waitlist signup error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}

module.exports = { signupWaitlist };
