const express = require("express");
const Hospital = require("../models/Hospital");
const router = express.Router();

// GET: Listimi i të gjitha spitaleve
router.get("/", async (req, res, next) => {
  try {
    const list = await Hospital.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET: Detajet e një spitali specifik
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Hospital.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Hospital not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;