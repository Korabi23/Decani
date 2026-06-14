const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// GET: Lexo të gjitha projektet e komunës
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    next(e);
  }
});

module.exports = router;