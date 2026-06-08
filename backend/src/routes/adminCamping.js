const express = require("express");
const Camping = require("../models/Camping");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const normalizeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// Këtu përdorim "/" sepse prefiksi është definuar në app.js si /api/admin/camping
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
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
      // Presim URL-të direkt nga AWS (vijnë nga req.body)
      coverImage: req.body.coverImage || "",
      images: req.body.images || [], 
    });

    if (!created.name) return res.status(400).json({ message: "Name is required" });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
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
      // Përditësojmë URL-të nëse janë dërguar
      ...(req.body.coverImage && { coverImage: req.body.coverImage }),
      ...(req.body.images && { images: req.body.images }),
    };

    const updated = await Camping.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Camping.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;