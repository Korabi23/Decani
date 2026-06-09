const express = require("express");
const Water = require("../models/Water");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); 
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    const photos = req.files ? req.files.map(f => f.location) : [];
    
    // Ruajmë si 'photos' (jo 'images')
    const created = await Water.create({
      ...req.body,
      photos: photos 
    });
    
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Water.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (Array.isArray(item.photos) && item.photos.length > 0) {
      for (const url of item.photos) {
        const key = url.split(".com/")[1];
        if (key) await deleteFromS3(key);
      }
    }
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

router.patch("/:id", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    const existing = await Water.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const updateData = { ...req.body };
    // Nëse ka foto të reja, përdori ato
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(f => f.location);
    }

    const updated = await Water.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

module.exports = router;