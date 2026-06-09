const express = require("express");
const Water = require("../models/Water");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); 
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

// GET: Lista e ujërave për admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto ujë/burim të ri
router.post("/", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    const photos = req.files ? req.files.map(f => f.location) : [];
    const created = await Water.create({
      ...req.body,
      photos: photos
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// DELETE: Fshi dhe pastro nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Water.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.photos && item.photos.length > 0) {
      for (const url of item.photos) {
        const key = url.split(".com/")[1];
        if (key) await deleteFromS3(key);
      }
    }
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;