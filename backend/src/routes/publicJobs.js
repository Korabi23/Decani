const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// Merr të gjitha punët
router.get("/", async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) { next(e); }
});

// Merr një punë specifike
router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (e) { next(e); }
});

module.exports = router;