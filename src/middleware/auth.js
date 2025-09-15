const jwt = require("jsonwebtoken");

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { authenticateAdmin };
