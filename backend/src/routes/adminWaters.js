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

// adminWaters.js

// Kur shton ujë të ri:
router.post("/", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    const photos = req.files ? req.files.map(f => f.location) : [];
    const created = await Water.create({
      ...req.body,
      images: photos // Këtu duhet të jetë "images" që të përputhet me frontend-in
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

// Kur bën update (PATCH):
router.patch("/:id", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.location); // Përditëso fushën "images"
    }
    const updated = await Water.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

module.exports = router;