const express = require("express");
const VideoAd = require("../models/VideoAd");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // AWS S3 Middleware
const router = express.Router();

// Merr videot për adminin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await VideoAd.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// Shto video të re (këtu ndodh lidhja me AWS)
router.post("/", requireAdmin, upload.single("video"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Video file missing" });
    const created = await VideoAd.create({ 
      title: req.body.title, 
      videoUrl: req.file.location 
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// Fshij videon
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await VideoAd.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (e) { next(e); }
});

module.exports = router;