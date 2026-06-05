const express = require("express");
const Car = require("../models/Car");

const router = express.Router();

router.get("/cars", async (req, res, next) => {
  try {
    const list = await Car.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});


router.get("/cars/:id", async (req, res, next) => {
  try {
    const item = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Not found" });

    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/cars/:id/like", async (req, res, next) => {
  try {
    const item = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Not found" });

    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;