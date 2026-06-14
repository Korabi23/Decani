const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// POST: Shto projekt të ri
router.post("/", async (req, res, next) => {
  try {
    const { title, subtitle, description, statusColor, type } = req.body;
    
    const newProject = new Project({
      title,
      subtitle,
      description,
      statusColor,
      type
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (e) {
    next(e);
  }
});

// DELETE: Fshi një projekt
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;