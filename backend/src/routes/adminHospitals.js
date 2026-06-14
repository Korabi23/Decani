const express = require("express");
const Hospital = require("../models/Hospital");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); 
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

// 1. GET: Listimi për Admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Hospital.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// 2. POST: Shto Spital të ri
router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    let servicesArray = [];
    if (req.body.services) {
      try { servicesArray = JSON.parse(req.body.services); } catch(err) { servicesArray = []; }
    }

    const item = await Hospital.create({
      name: req.body.name,
      type: req.body.type || "Publik",
      location: req.body.location || "",
      schedule: req.body.schedule || "",
      beds: Number(req.body.beds || 0),
      doctors: Number(req.body.doctors || 0),
      established: req.body.established ? Number(req.body.established) : null,
      description: req.body.description || "",
      contact: req.body.contact || "",
      emergency: req.body.emergency || "",
      services: servicesArray,
      image: req.file ? req.file.location : "", 
    });

    res.status(201).json(item);
  } catch (e) { next(e); }
});

// 3. PATCH: Përditëso Spitalin
router.patch("/:id", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const existing = await Hospital.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    let servicesArray = existing.services;
    if (req.body.services) {
      try { servicesArray = JSON.parse(req.body.services); } catch(err) { servicesArray = existing.services; }
    }

    const update = {
      name: req.body.name || existing.name,
      type: req.body.type || existing.type,
      location: req.body.location !== undefined ? req.body.location : existing.location,
      schedule: req.body.schedule !== undefined ? req.body.schedule : existing.schedule,
      beds: req.body.beds !== undefined ? Number(req.body.beds) : existing.beds,
      doctors: req.body.doctors !== undefined ? Number(req.body.doctors) : existing.doctors,
      established: req.body.established !== undefined ? Number(req.body.established) : existing.established,
      description: req.body.description !== undefined ? req.body.description : existing.description,
      contact: req.body.contact !== undefined ? req.body.contact : existing.contact,
      emergency: req.body.emergency !== undefined ? req.body.emergency : existing.emergency,
      services: servicesArray,
    };

    if (req.file) {
      if (existing.image && existing.image.includes(".com/")) {
        const oldKey = existing.image.split(".com/")[1];
        await deleteFromS3(oldKey).catch(() => null);
      }
      update.image = req.file.location;
    }

    const item = await Hospital.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
  } catch (e) { next(e); }
});

// 4. DELETE: Fshi Spitalin
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Hospital.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.image && item.image.includes(".com/")) {
      const key = item.image.split(".com/")[1];
      await deleteFromS3(key).catch(() => null);
    }

    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;