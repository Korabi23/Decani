const express = require("express");
const Job = require("../models/Job");
const { requireAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try { res.json(await Job.find().sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Job.create(req.body)); }
  catch (e) { next(e); }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try { res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try { await Job.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }
  catch (e) { next(e); }
});

module.exports = router;