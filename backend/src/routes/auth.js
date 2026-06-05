const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email = "", password = "" } = req.body;

  // ✅ Check env exists
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    return res
      .status(500)
      .json({ message: "Admin credentials not configured" });
  }

  // ✅ Check email
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Compare plain password with HASH
  const ok = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Generate token
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = router;
