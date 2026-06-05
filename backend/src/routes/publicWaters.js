const express = require("express");
const Water = require("../models/Water");

const router = express.Router();

router.get("/waters", async (_req, res) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/waters/:id", async (req, res) => {
  try {
    const item = await Water.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;