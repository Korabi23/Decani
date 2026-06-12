const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const JobApplication = require("../models/JobApplication");
const BusinessSuggestion = require("../models/BusinessSuggestion");

const router = express.Router();

// ✅ Përditësuar me .populate("jobId") për të marrë detajet e punës
router.get("/job-applications", requireAdmin, async (req, res, next) => {
  try { 
    const applications = await JobApplication.find({})
      .populate("jobId", "title company") // ✅ Tërheq vetëm titullin dhe kompaninë
      .sort({ createdAt: -1 }); 
    res.json(applications); 
  }
  catch (e) { next(e); }
});

router.patch("/job-applications/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.get("/business-suggestions", requireAdmin, async (req, res, next) => {
  try { 
    res.json(await BusinessSuggestion.find({}).sort({ createdAt: -1 })); 
  }
  catch (e) { next(e); }
});

router.patch("/business-suggestions/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await BusinessSuggestion.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

module.exports = router;