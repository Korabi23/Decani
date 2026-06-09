const express = require("express");
const FaunaVideo = require("../models/FaunaVideo");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload");
const { deleteFromS3 } = require("../services/s3Service");
const router = express.Router();

// Tani kjo përgjigjet kur thërritet: /api/admin/fauna/
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await FaunaVideo.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, upload.single("video"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Video required" });
    const created = await FaunaVideo.create({ ...req.body, video: req.file.location });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put("/:id", requireAdmin, upload.single("video"), async (req, res, next) => {
  try {
    const existing = await FaunaVideo.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    
    let patch = { ...req.body };
    if (req.file) {
      if (existing.video) {
        const key = existing.video.split(".com/").pop();
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
    if (deleted?.video) {
        const key = deleted.video.split(".com/").pop();
        await deleteFromS3(key);
    }
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

module.exports = router;