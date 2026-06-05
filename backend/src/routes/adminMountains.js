// src/routes/adminMountains.js
const express = require("express");
const Mountain = require("../models/Mountain");
const { requireAdmin } = require("../middleware/auth");
// Sigurohu që ky import thërret skedarin e saktë me multer-s3
const upload = require("../middleware/awsUpload"); 

const router = express.Router();

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseStops(raw) {
  if (!raw) return [];
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((x) => ({
      title: String(x?.title || ""),
      badgeText: String(x?.badgeText || ""),
      badgeTint: String(x?.badgeTint || ""),
      badgeColor: String(x?.badgeColor || ""),
      desc: String(x?.desc || ""),
    }));
  } catch {
    return [];
  }
}

router.get("/mountains", requireAdmin, async (_req, res, next) => {
  try {
    const list = await Mountain.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// ROUTER POST - Përdor middleware-in AWS S3
router.post(
  "/mountains",
  requireAdmin,
  upload.array("images", 10), 
  async (req, res, next) => {
    try {
      const { name, desc, locationName, latitude, longitude, altitude, climate, attractions, visits, rating, stops } = req.body;

      if (!String(name || "").trim()) {
        return res.status(400).json({ message: "name is required" });
      }

      // Kjo pjesë merr URL-të direkt nga AWS S3 pasi middleware-i i ngarkon
      const uploadedImages = req.files ? req.files.map((f) => f.location) : [];

      const created = await Mountain.create({
        name: String(name || "").trim(),
        desc: String(desc || "").trim(),
        locationName: String(locationName || "Deçan").trim(),
        latitude: toNumber(latitude, 42.5428),
        longitude: toNumber(longitude, 20.2781),
        altitude: String(altitude || "").trim(),
        climate: String(climate || "").trim(),
        attractions: String(attractions || "").trim(),
        visits: toNumber(visits, 0),
        rating: toNumber(rating, 0),
        images: uploadedImages, // Ruajmë URL-të e S3 në bazën e të dhënave
        stops: parseStops(stops),
      });

      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }
);

// ROUTER PATCH - Përdor middleware-in AWS S3
router.patch(
  "/mountains/:id",
  requireAdmin,
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      const existing = await Mountain.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Mountain not found" });

      const { name, desc, locationName, latitude, longitude, altitude, climate, attractions, visits, rating, stops, keepImages } = req.body;

      const parsedKeepImages = keepImages ? JSON.parse(keepImages) : [];
      const uploadedImages = req.files ? req.files.map((f) => f.location) : [];

      existing.name = String(name || existing.name).trim();
      existing.desc = String(desc || "").trim();
      existing.locationName = String(locationName || "Deçan").trim();
      existing.latitude = toNumber(latitude, 42.5428);
      existing.longitude = toNumber(longitude, 20.2781);
      existing.altitude = String(altitude || "").trim();
      existing.climate = String(climate || "").trim();
      existing.attractions = String(attractions || "").trim();
      existing.visits = toNumber(visits, 0);
      existing.rating = toNumber(rating, 0);
      existing.stops = parseStops(stops);
      
      // Bashkojmë fotot ekzistuese me ato të reja nga S3
      existing.images = [...parsedKeepImages, ...uploadedImages];

      await existing.save();
      res.json(existing);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/mountains/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Mountain.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Mountain not found" });
    res.json({ message: "Mountain deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;