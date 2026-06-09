// publicTouristPhotos.js
const express = require("express");
const TouristPhoto = require("../models/TouristPhoto");
const router = express.Router();

// Ndrysho nga "/tourist-photos" në "/"
router.get("/", async (_req, res) => {
  try {
    const list = await TouristPhoto.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

// Ndrysho nga "/tourist-photos/:id" në "/:id"
router.get("/:id", async (req, res) => {
  try {
    const item = await TouristPhoto.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

module.exports = router;