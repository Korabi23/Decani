const express = require("express");
const TouristPhoto = require("../models/TouristPhoto"); // Ndryshon modeli këtu
const router = express.Router();

// Tani rruga është thjesht "/", sepse në app.js e ke definuar:
// app.use("/api/public/waters", publicWaters);
router.get("/", async (_req, res) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.error("❌ Gabim te GET /api/public/waters:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Rruga për marrjen e një elementi specifik është "/:id"
router.get("/:id", async (req, res) => {
  try {
    const item = await Water.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.error(`❌ Gabim te GET /api/public/waters/${req.params.id}:`, e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;