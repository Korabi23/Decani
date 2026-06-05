const express = require("express");
const Mountain = require("../models/Mountain");

const router = express.Router();

router.get("/mountains", async (_req, res, next) => {
  try {
    const list = await Mountain.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get("/mountains/:id", async (req, res, next) => {
  try {
    const item = await Mountain.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Mountain not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;