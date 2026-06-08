const express = require("express");
const Camping = require("../models/Camping");
const { requireAdmin } = require("../middleware/auth");
const router = express.Router();

// Rruga është /api/admin/camping (në app.js), pra këtu përdorim "/"
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    // Presim JSON nga trupi i kërkesës (nuk ka më req.files)
    const created = await Camping.create({
      ...req.body,
      // Sigurohemi që numrat janë korrekt
      price: Number(req.body.price) || 0,
      rating: Number(req.body.rating) || 0,
      reviews: Number(req.body.reviews) || 0
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await Camping.findByIdAndUpdate(req.params.id, req.body, { new: true });
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