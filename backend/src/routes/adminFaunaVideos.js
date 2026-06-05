const express = require("express");
const FaunaVideo = require("../models/FaunaVideo");
const { requireAdmin } = require("../middleware/auth");
const { uploadFaunaVideo } = require("../middleware/faunaVideosUpload");

const router = express.Router();

router.get("/fauna-videos", requireAdmin, async (req, res, next) => {
  try {
    const list = await FaunaVideo.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});


router.post(
  "/fauna-videos",
  requireAdmin,
  uploadFaunaVideo.single("video"),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: "Video is required" });

      const videoPath = `/uploads/fauna-videos/${req.file.filename}`;

      const created = await FaunaVideo.create({
        title: String(req.body.title || ""),
        animal: String(req.body.animal || ""),
        emoji: String(req.body.emoji || "🦌"),
        description: String(req.body.description || ""),
        location: String(req.body.location || ""),
        video: videoPath,
      });

      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }
);


router.put(
  "/fauna-videos/:id",
  requireAdmin,
  uploadFaunaVideo.single("video"),
  async (req, res, next) => {
    try {
      const patch = {
        title: String(req.body.title || ""),
        animal: String(req.body.animal || ""),
        emoji: String(req.body.emoji || "🦌"),
        description: String(req.body.description || ""),
        location: String(req.body.location || ""),
      };

      if (req.file) patch.video = `/uploads/fauna-videos/${req.file.filename}`;

      const updated = await FaunaVideo.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/fauna-videos/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await FaunaVideo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;