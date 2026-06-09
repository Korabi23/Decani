// publicWaters.js
const express = require("express");
const Water = require("../models/Water");
const router = express.Router();

// Ndrysho GET nga "/waters" në "/"
router.get("/", async (_req, res) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Ndrysho GET/:id nga "/waters/:id" në "/:id"
router.get("/:id", async (req, res) => {
  try {
    const item = await Water.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;