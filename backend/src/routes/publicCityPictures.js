const express = require("express");
const CityPicture = require("../models/CityPicture");

const router = express.Router();

router.get("/city-pictures", async (req, res, next) => {
  try {
    const list = await CityPicture.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get("/city-pictures/:id", async (req, res, next) => {
  try {
    const item = await CityPicture.findByIdAndUpdate(
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

router.post("/city-pictures/:id/like", async (req, res, next) => {
  try {
    const item = await CityPicture.findByIdAndUpdate(
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
