const express = require("express");
const TouristPhoto = require("../models/TouristPhoto"); // Rruga e saktë (një nivel lart)
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); 
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

// GET: Lista e fotove
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await TouristPhoto.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto foto (pranon shumë foto në fushën 'photos')
router.post("/", requireAdmin, upload.array("photos", 10), async (req, res, next) => {
  try {
    // Marrja e listës së fotove nga AWS
    const photos = req.files ? req.files.map((f) => f.location) : [];
    
    if (photos.length === 0) {
      return res.status(400).json({ message: "Së paku një foto është e domosdoshme" });
    }

    const created = await TouristPhoto.create({
      ...req.body,
      photos: photos // Ruhet si array në MongoDB
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// DELETE: Fshi fotot nga S3 dhe nga DB
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await TouristPhoto.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshi çdo foto nga S3
    if (item.photos && item.photos.length > 0) {
      for (const url of item.photos) {
        const key = url.split(".com/")[1];
        if (key) await deleteFromS3(key);
      }
    }
    
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }

  // PATCH: Edito destinacionin ekzistues dhe menaxho fotot
router.patch("/:id", requireAdmin, upload.array("photos", 10), async (req, res, next) => {
  try {
    const { title, location, description, type, keepPhotos } = req.body;
    
    // 1. Merr fotot e reja nëse ka ngarkuar admini
    let newPhotos = req.files ? req.files.map((f) => f.location) : [];
    
    // 2. Merr fotot e vjetra që admini zgjodhi t'i mbajë (KEEP)
    let existingPhotos = [];
    if (keepPhotos) {
      existingPhotos = JSON.parse(keepPhotos);
    }
    
    // 3. Bashko fotot e vjetra me ato të rejat
    const finalPhotos = [...existingPhotos, ...newPhotos];

    if (finalPhotos.length === 0) {
      return res.status(400).json({ message: "Së paku një foto është e domosdoshme" });
    }

    const updated = await TouristPhoto.findByIdAndUpdate(
      req.params.id,
      { title, location, description, type, photos: finalPhotos },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Destinacioni nuk u gjet" });
    
    res.json(updated);
  } catch (e) { 
    next(e); 
  }
});
});

module.exports = router;