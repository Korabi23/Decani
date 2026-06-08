const express = require("express");
const TouristPhoto = require("../../models/TouristPhoto");
const { requireAdmin } = require("../../middleware/auth");
const upload = require("../../middleware/awsUpload"); 
const { deleteFromS3 } = require("../../services/s3Service");

const router = express.Router();

// GET: Lista e fotove për admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await TouristPhoto.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto foto të re (me AWS S3)
router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.location : null;
    
    if (!imageUrl) {
      return res.status(400).json({ message: "Fotoja është e domosdoshme" });
    }

    const created = await TouristPhoto.create({
      ...req.body,
      image: imageUrl
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// DELETE: Fshi foton dhe pastro nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await TouristPhoto.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshi nga S3
    if (item.image) {
      const key = item.image.split(".com/")[1];
      await deleteFromS3(key);
    }
    
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;