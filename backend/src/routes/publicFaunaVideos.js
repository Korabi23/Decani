const express = require("express");
const FaunaVideo = require("../models/FaunaVideo");

const router = express.Router();

// Në vend të "/fauna-videos", shkruaj "/"
router.get("/", async (req, res, next) => {
  try {
    const list = await FaunaVideo.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// Në vend të "/fauna-videos/:id", shkruaj "/:id"
router.get("/:id", async (req, res, next) => {
  try {
    const item = await FaunaVideo.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
});

// Në vend të "/fauna-videos/:id/like", shkruaj "/:id/like"
router.post("/:id/like", async (req, res, next) => {
  try {
    const item = await FaunaVideo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
});

module.exports = router;