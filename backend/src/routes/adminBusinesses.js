// backend/src/routes/adminBusinesses.js
const express = require("express");
const Business = require("../models/Business");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // Shto këtë

const router = express.Router();


router.get("/businesses", requireAdmin, async (req, res, next) => {
  try {
    const list = await Business.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.post("/businesses", requireAdmin, upload.array("images", 8), async (req, res, next) => {
  try {
    const { name, category, location, description, phone, whatsapp, workingHours } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "name and category are required" });
    }

    // Merr URL-të nga AWS S3
    const uploadedImages = req.files ? req.files.map((f) => f.location) : [];

    const created = await Business.create({
      name: String(name).trim(),
      category: String(category).trim(),
      location: String(location || ""),
      description: String(description || ""),
      phone: String(phone || ""),
      whatsapp: String(whatsapp || ""),
      images: uploadedImages, // Këtu ruhen URL-të nga AWS
      workingHours: workingHours ? JSON.parse(workingHours) : {},
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/businesses/:id", requireAdmin, upload.array("images", 8), async (req, res, next) => {
  try {
    const existing = await Business.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const { name, category, location, description, phone, whatsapp, workingHours, keepImages } = req.body;
    
    // Konverto keepImages (fotot që përdoruesi do t'i mbajë)
    const parsedKeepImages = keepImages ? JSON.parse(keepImages) : [];
    const newUploadedImages = req.files ? req.files.map((f) => f.location) : [];

    existing.name = name || existing.name;
    existing.category = category || existing.category;
    existing.location = location || existing.location;
    // ... përditëso fushat e tjera
    existing.images = [...parsedKeepImages, ...newUploadedImages]; // Bashkimi i fotove

    await existing.save();
    res.json(existing);
  } catch (e) {
    next(e);
  }
});


// Importo deleteFromS3 nga shërbimi që krijuam
// Importo deleteFromS3 nga shërbimi që krijuam
const { deleteFromS3 } = require("../services/s3Service");

router.delete("/businesses/:id", requireAdmin, async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Not found" });

    // Fshi fotot nga AWS para se të fshish dokumentin
    if (business.images && business.images.length > 0) {
      for (const url of business.images) {
        const key = url.split(".com/")[1];
        await deleteFromS3(key);
      }
    }

    await business.deleteOne();
    res.json({ message: "Deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
