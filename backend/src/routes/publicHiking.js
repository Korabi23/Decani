const express = require("express");
const Hiking = require("../models/Hiking");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const list = await Hiking.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.log("❌ GET /api/public/hiking:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Hiking.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.log("❌ GET /api/public/hiking/:id:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

module.exports = router;
