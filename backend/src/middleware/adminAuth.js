// src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!token) return res.status(401).json({ message: "No admin token" });

    const secret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token, secret);

    // If your token includes role, you can enforce it:
    // if (payload.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
}

module.exports = { requireAdmin };
