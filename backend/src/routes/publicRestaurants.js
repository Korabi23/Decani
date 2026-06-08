const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const list = await Restaurant.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.log("❌ GET /api/public/restaurants:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Restaurant.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.log("❌ GET /api/public/restaurants/:id:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
});

module.exports = router;