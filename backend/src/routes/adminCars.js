const express = require("express");
const Car = require("../models/Car");
const { uploadCars } = require("../middleware/carsUpload");
const { requireAdmin } = require("../middleware/auth"); // same as your other admin routes

const router = express.Router();


router.get("/cars", requireAdmin, async (req, res, next) => {
  try {
    const list = await Car.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});


router.post(
  "/cars",
  requireAdmin,
  uploadCars.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      const item = await Car.create({
        image: `/uploads/veturat/${req.file.filename}`,
        description: req.body.description || "",
        author: req.body.author || "",
      });

      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/cars/:id",
  requireAdmin,
  uploadCars.single("image"),
  async (req, res, next) => {
    try {
      const update = {
        description: req.body.description,
        author: req.body.author,
      };

      if (req.file) {
        update.image = `/uploads/veturat/${req.file.filename}`;
      }

      const item = await Car.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });

      if (!item) return res.status(404).json({ message: "Not found" });

      res.json(item);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/cars/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Car.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;