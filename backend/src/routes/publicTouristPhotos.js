const express = require("express");
const TouristPhoto = require("../models/TouristPhoto");

const router = express.Router();

router.get("/tourist-photos", async (_req, res) => {
  try {
    const list = await TouristPhoto.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.log("❌ GET /api/public/tourist-photos:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

router.get("/tourist-photos/:id", async (req, res) => {
  try {
    const item = await TouristPhoto.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.log("❌ GET /api/public/tourist-photos/:id:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

module.exports = router;
