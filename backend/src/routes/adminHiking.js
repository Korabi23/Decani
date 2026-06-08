const express = require("express");
const Hiking = require("../models/Hiking");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload");
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

// GET: Lista e shtigjeve për admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Hiking.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto shteg të ri
router.post("/", requireAdmin, upload.array("images", 10), async (req, res, next) => {
  try {
    const { title, location, difficulty, duration, distance, elevation, desc } = req.body;
    const images = req.files ? req.files.map((f) => f.location) : [];
    
    const created = await Hiking.create({ 
      title, location, difficulty, duration, distance, elevation, desc, images 
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// DELETE: Fshi shtegun dhe fotot nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Hiking.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

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