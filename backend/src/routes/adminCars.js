const express = require("express");
const Car = require("../models/Car");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // Përdorim middleware-in AWS
const { deleteFromS3 } = require("../services/s3Service"); // Për fshirje nga AWS

const router = express.Router();

// 1. GET: Listimi i makinave
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Car.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// 2. POST: Shto makinë me shumë foto në S3
router.post("/", requireAdmin, upload.array("images", 10), async (req, res, next) => {
  try {
    // Marrja e listës së fotove të ngarkuara në S3
    const uploadedImages = req.files ? req.files.map((f) => f.location) : [];

    if (uploadedImages.length === 0) {
      return res.status(400).json({ message: "Së paku një foto është e domosdoshme" });
    }

    const item = await Car.create({
      images: uploadedImages, // Ruhet si array në MongoDB (Sigurohu që modeli Car e ka fushën 'images')
      description: String(req.body.description || ""),
      author: String(req.body.author || ""),
    });

    res.status(201).json(item);
  } catch (e) { next(e); }
});

// 3. PATCH (ose PUT): Përditëso makinën dhe fshi fotot e vjetra nga S3
router.patch("/:id", requireAdmin, upload.array("images", 10), async (req, res, next) => {
  try {
    const existing = await Car.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const update = {
      description: req.body.description || existing.description,
      author: req.body.author || existing.author,
    };

    // Nëse admini ka përzgjedhur foto të reja, i zëvendësojmë ato
    if (req.files && req.files.length > 0) {
      // Fshijmë të gjitha fotot e vjetra ekzistuese nga S3
      if (existing.images && existing.images.length > 0) {
        for (const url of existing.images) {
          const oldKey = url.split(".com/")[1];
          if (oldKey) await deleteFromS3(oldKey);
        }
      }
      // Vendosim URL-të e fotove të reja
      update.images = req.files.map((f) => f.location);
    }

    const item = await Car.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
  } catch (e) { next(e); }
});

// 4. DELETE: Fshi makinën dhe të gjitha fotot nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Car.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshi të gjitha fotot e lidhura me këtë makinë nga S3
    if (item.images && item.images.length > 0) {
      for (const url of item.images) {
        const key = url.split(".com/")[1];
        if (key) await deleteFromS3(key);
      }
    }

    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;