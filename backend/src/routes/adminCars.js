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

// 2. POST: Shto makinë me foto në S3
router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const item = await Car.create({
      image: req.file.location, // URL-ja nga S3
      description: String(req.body.description || ""),
      author: String(req.body.author || ""),
    });

    res.status(201).json(item);
  } catch (e) { next(e); }
});

// 3. PATCH (ose PUT): Përditëso makinën dhe fshi foton e vjetër nga S3
router.patch("/:id", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const existing = await Car.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const update = {
      description: req.body.description || existing.description,
      author: req.body.author || existing.author,
    };

    if (req.file) {
      // Fshi foton e vjetër nga S3
      if (existing.image && existing.image.includes(".com/")) {
        const oldKey = existing.image.split(".com/")[1];
        await deleteFromS3(oldKey);
      }
      update.image = req.file.location;
    }

    const item = await Car.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
  } catch (e) { next(e); }
});

// 4. DELETE: Fshi makinën dhe foton nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Car.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshi foton nga S3
    if (item.image && item.image.includes(".com/")) {
      const key = item.image.split(".com/")[1];
      await deleteFromS3(key);
    }

    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;