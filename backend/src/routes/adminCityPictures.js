const express = require("express");
const CityPicture = require("../models/CityPicture");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload");
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();
// Shto këtë rrugë për të marrë listën e fotove
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await CityPicture.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { 
    next(e); 
  }
});
// Rruga finale do të jetë: /api/admin/
router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const created = await CityPicture.create({
      image: req.file.location, 
      description: String(req.body.description || ""),
      author: String(req.body.author || ""),
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put("/:id", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const existing = await CityPicture.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const patch = {
      description: String(req.body.description || ""),
      author: String(req.body.author || ""),
    };

    if (req.file) {
      if (existing.image && existing.image.includes(".com/")) {
        const oldKey = existing.image.split(".com/")[1];
        await deleteFromS3(oldKey);
      }
      patch.image = req.file.location;
    }

    const updated = await CityPicture.findByIdAndUpdate(req.params.id, patch, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await CityPicture.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    if (deleted.image && deleted.image.includes(".com/")) {
      const key = deleted.image.split(".com/")[1];
      await deleteFromS3(key);
    }

    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;