const express = require("express");
const Camping = require("../models/Camping");
const { requireAdmin } = require("../middleware/auth");
const { campingFields } = require("../middleware/campingUpload");

const router = express.Router();

const normalizeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toPath = (filename) => `/uploads/camping/${filename}`;

router.get("/camping", requireAdmin, async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});


router.post("/camping", requireAdmin, campingFields, async (req, res, next) => {
  try {
    const cover = req.files?.coverImage?.[0]?.filename || "";
    const gallery = (req.files?.images || []).map((f) => f.filename);

    const created = await Camping.create({
      name: String(req.body.name || "").trim(),
      location: String(req.body.location || ""),
      mountain: String(req.body.mountain || ""),
      price: normalizeNumber(req.body.price, 0),
      surface: String(req.body.surface || ""),
      capacity: String(req.body.capacity || ""),
      rooms: String(req.body.rooms || ""),
      coordinates: String(req.body.coordinates || ""),
      rating: normalizeNumber(req.body.rating, 0),
      reviews: normalizeNumber(req.body.reviews, 0),
      phone: String(req.body.phone || ""),
      whatsapp: String(req.body.whatsapp || ""),

      coverImage: cover ? toPath(cover) : "",
      images: gallery.map(toPath),
    });

    if (!created.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});


router.put("/camping/:id", requireAdmin, campingFields, async (req, res, next) => {
  try {
    const patch = {
      name: String(req.body.name || "").trim(),
      location: String(req.body.location || ""),
      mountain: String(req.body.mountain || ""),
      price: normalizeNumber(req.body.price, 0),
      surface: String(req.body.surface || ""),
      capacity: String(req.body.capacity || ""),
      rooms: String(req.body.rooms || ""),
      coordinates: String(req.body.coordinates || ""),
      rating: normalizeNumber(req.body.rating, 0),
      reviews: normalizeNumber(req.body.reviews, 0),
      phone: String(req.body.phone || ""),
      whatsapp: String(req.body.whatsapp || ""),
    };

    const cover = req.files?.coverImage?.[0]?.filename || "";
    if (cover) patch.coverImage = toPath(cover);

    const gallery = (req.files?.images || []).map((f) => f.filename);
    if (gallery.length > 0) patch.images = gallery.map(toPath);

    const updated = await Camping.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.delete("/camping/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Camping.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;