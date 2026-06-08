const express = require("express");
const FaunaVideo = require("../models/FaunaVideo");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // Përdor middleware-in AWS
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await FaunaVideo.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, upload.single("video"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Video is required" });

    const created = await FaunaVideo.create({
      title: String(req.body.title || ""),
      animal: String(req.body.animal || ""),
      emoji: String(req.body.emoji || "🦌"),
      description: String(req.body.description || ""),
      location: String(req.body.location || ""),
      video: req.file.location, // URL nga S3
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put("/:id", requireAdmin, upload.single("video"), async (req, res, next) => {
  try {
    const existing = await FaunaVideo.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const patch = {
      title: req.body.title || existing.title,
      animal: req.body.animal || existing.animal,
      emoji: req.body.emoji || existing.emoji,
      description: req.body.description || existing.description,
      location: req.body.location || existing.location,
    };

    if (req.file) {
      // Fshi videon e vjetër nga S3
      if (existing.video && existing.video.includes(".com/")) {
        const key = existing.video.split(".com/")[1];
        await deleteFromS3(key);
      }
      patch.video = req.file.location;
    }

    const updated = await FaunaVideo.findByIdAndUpdate(req.params.id, patch, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await FaunaVideo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    
    // Fshi videon nga S3
    if (deleted.video && deleted.video.includes(".com/")) {
      const key = deleted.video.split(".com/")[1];
      await deleteFromS3(key);
    }
    
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;