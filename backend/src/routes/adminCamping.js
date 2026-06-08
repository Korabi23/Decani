const express = require("express");
const multer = require("multer");
const path = require("path");
const Camping = require("../models/Camping");
const { requireAdmin } = require("../middleware/auth");
const router = express.Router();

// Konfigurimi i Multer për ruajtjen e fotove
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Sigurohu që folderi 'uploads' ekziston në root
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Rruga GET
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// Rruga POST - Tani pranon foto (coverImage dhe images)
router.post("/", requireAdmin, upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'images', maxCount: 6 }
]), async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Nëse ka foto, ruajmë rrugën (path) e tyre në bazën e të dhënave
    if (req.files) {
      if (req.files.coverImage) {
        data.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
      if (req.files.images) {
        data.images = req.files.images.map(f => `/uploads/${f.filename}`);
      }
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

// Rruga PUT
router.put("/:id", requireAdmin, upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'images', maxCount: 6 }
]), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files.coverImage) data.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      if (req.files.images) data.images = req.files.images.map(f => `/uploads/${f.filename}`);
    }
    
    const updated = await Camping.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

// Rruga DELETE
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Camping.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;