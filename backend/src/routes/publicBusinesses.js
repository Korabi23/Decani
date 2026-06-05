// src/routes/publicBusinesses.js
const express = require("express");
const Business = require("../models/Business");

const router = express.Router();


router.get("/businesses", async (req, res, next) => {
  try {
    const list = await Business.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET /api/public/businesses/:id
router.get("/businesses/:id", async (req, res, next) => {
  try {
    const item = await Business.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Business not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
