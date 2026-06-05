const express = require("express");
const CityPicture = require("../models/CityPicture");
const { requireAdmin } = require("../middleware/auth");
const { uploadCityPictures } = require("../middleware/cityPicturesUpload");

const router = express.Router();

router.get("/city-pictures", requireAdmin, async (req, res, next) => {
  try {
    const list = await CityPicture.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/city-pictures",
  requireAdmin,
  uploadCityPictures.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const imagePath = `/uploads/city-pictures/${req.file.filename}`;

      const created = await CityPicture.create({
        image: imagePath,
        description: String(req.body.description || ""),
        author: String(req.body.author || ""),
      });

      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/city-pictures/:id",
  requireAdmin,
  uploadCityPictures.single("image"),
  async (req, res, next) => {
    try {
      const patch = {
        description: String(req.body.description || ""),
        author: String(req.body.author || ""),
      };

      if (req.file) {
        patch.image = `/uploads/city-pictures/${req.file.filename}`;
      }

      const updated = await CityPicture.findByIdAndUpdate(req.params.id, patch, {
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

router.delete("/city-pictures/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await CityPicture.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
