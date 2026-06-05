// src/routes/public.js
const express = require("express");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const Business = require("../models/Business");
const Property = require("../models/Property"); // ✅ NEW
const { upload } = require("../middleware/upload");

const router = express.Router();

function makeTrackingCode() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DEC-${rand}`;
}

router.get("/businesses", async (req, res, next) => {
  try {
    const list = await Business.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get("/businesses/:id", async (req, res, next) => {
  try {
    const item = await Business.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Business not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});


router.get("/properties", async (req, res, next) => {
  try {
    const { category, listing, search } = req.query;

    const q = {};
    if (category && category !== "all") q.category = String(category).toLowerCase();
    if (listing && listing !== "all") q.listing = String(listing).toLowerCase();

    if (search && String(search).trim()) {
      const s = String(search).trim();
      q.$or = [
        { title: { $regex: s, $options: "i" } },
        { desc: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } },
      ];
    }

    const list = await Property.find(q).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});


router.get("/properties/:id", async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Property not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

/**
 * jobs
 */
router.get("/jobs", async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) {
    next(e);
  }
});

router.get("/jobs/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (e) {
    next(e);
  }
});

router.get("/application-status/:code", async (req, res, next) => {
  try {
    const code = (req.params.code || "").trim().toUpperCase();

    const app = await JobApplication.findOne({ trackingCode: code })
      .populate("jobId")
      .lean();

    if (!app) return res.status(404).json({ message: "Code not found" });

    res.json({
      trackingCode: app.trackingCode,
      status: app.status,
      jobTitle: app.jobId?.title || "",
      company: app.jobId?.company || "",
      updatedAt: app.updatedAt,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/job-applications", upload.single("cv"), async (req, res, next) => {
  try {
    const { jobId, fullName, email, message } = req.body;

    if (!jobId || !fullName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(400).json({ message: "Invalid jobId" });

    const cvUrl = req.file ? `/uploads/${req.file.filename}` : "";

    let trackingCode = makeTrackingCode();
    for (let i = 0; i < 5; i++) {
      const exists = await JobApplication.findOne({ trackingCode }).lean();
      if (!exists) break;
      trackingCode = makeTrackingCode();
    }

    const created = await JobApplication.create({
      jobId,
      fullName,
      email,
      message: message || "",
      cvUrl,
      trackingCode,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted ✅",
      applicationId: created._id,
      trackingCode: created.trackingCode,
      cvUrl,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
