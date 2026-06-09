const express = require("express");
const Property = require("../models/Property");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await Property.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) { next(e); }
});

module.exports = router;