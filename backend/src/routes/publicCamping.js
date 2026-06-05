const express = require("express");
const Camping = require("../models/Camping");

const router = express.Router();


router.get("/camping", async (req, res, next) => {
  try {
    const list = await Camping.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get("/camping/:id", async (req, res, next) => {
  try {
    const item = await Camping.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;