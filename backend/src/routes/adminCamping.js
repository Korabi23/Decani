const express = require("express");
const Camping = require("../models/Camping");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // Përdor middleware-in tënd të S3
const { deleteFromS3 } = require("../services/s3Service");
const router = express.Router();

// GET: Lista e kampeve
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto kamp të ri me foto në S3
router.post("/", requireAdmin, upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'images', maxCount: 6 }
]), async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Marrja e linkeve nga S3 (req.files është objekt sepse përdorim fields)
    if (req.files) {
      if (req.files.coverImage) data.coverImage = req.files.coverImage[0].location;
      if (req.files.images) data.images = req.files.images.map(f => f.location);
    }

    const created = await Camping.create({
      ...data,
      price: Number(req.body.price) || 0,
      rating: Number(req.body.rating) || 0,
      reviews: Number(req.body.reviews) || 0
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// PUT: Përditëso kampin (me mundësi ngarkimi fotosh të reja)
router.put("/:id", requireAdmin, upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'images', maxCount: 6 }
]), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files.coverImage) data.coverImage = req.files.coverImage[0].location;
      if (req.files.images) data.images = req.files.images.map(f => f.location);
    }
    
    const updated = await Camping.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE: Fshi kampin dhe fotot nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Camping.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshirja e fotos kryesore nga S3
    if (item.coverImage) {
      const key = item.coverImage.split(".com/")[1];
      await deleteFromS3(key);
    }

    // Fshirja e galerisë nga S3
    if (item.images && item.images.length > 0) {
      for (const url of item.images) {
        const key = url.split(".com/")[1];
        await deleteFromS3(key);
      }
    }

    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;