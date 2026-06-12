const express = require("express");
const VideoAd = require("../models/VideoAd");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await VideoAd.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

module.exports = router;