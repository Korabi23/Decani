console.log("✅ admin routes loaded (AWS Enabled)");

const express = require("express");
const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const Business = require("../models/Business");
const Property = require("../models/Property");
const Mountain = require("../models/Mountain");
const Hiking = require("../models/Hiking");
const TouristPhoto = require("../models/TouristPhoto");
const Restaurant = require("../models/Restaurant");
const Water = require("../models/Water");
const CityPicture = require("../models/CityPicture"); // Shto këtë rresht
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); // Ky është middleware-i i ri AWS

const router = express.Router();

/* =========================================================
   ✅ SHARED HELPERS
========================================================= */

const parseJsonArray = (raw) => {
  try {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
};

const toSafeNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

/* =========================================================
   ✅ CRUD ROUTES (Të gjitha përdorin 'upload.array')
========================================================= */

// MOUNTAINS
router.post("/mountains", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const { name, desc, locationName, latitude, longitude, altitude, climate, attractions, visits, rating, stops } = req.body;
    const images = (req.files || []).map((f) => f.location); // S3 URL

    const created = await Mountain.create({
      name, desc, locationName, latitude, longitude, altitude, climate, attractions, visits, rating,
      images,
      stops: parseJsonArray(stops),
    });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// BUSINESSES
router.post("/businesses", requireAdmin, upload.array("images", 8), async (req, res) => {
  try {
    const { name, category, location, description, phone, whatsapp } = req.body;
    const images = (req.files || []).map((f) => f.location);
    const created = await Business.create({ name, category, location, description, phone, whatsapp, images });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PROPERTIES
router.post("/properties", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const { category, listing, title, price, desc, location, phone } = req.body;
    const images = (req.files || []).map((f) => f.location);
    const created = await Property.create({ category, listing, title, price, desc, location, phone, images, image: images[0] });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// HIKING
router.post("/hiking", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const { title, location, difficulty, duration, distance, elevation, desc } = req.body;
    const images = (req.files || []).map((f) => f.location);
    const created = await Hiking.create({ title, location, difficulty, duration, distance, elevation, desc, images });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// TOURIST PHOTOS
router.post("/tourist-photos", requireAdmin, upload.array("photos", 10), async (req, res) => {
  try {
    const { title, location, description, type } = req.body;
    const photos = (req.files || []).map((f) => f.location);
    const created = await TouristPhoto.create({ title, location, description, type, photos });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// RESTAURANTS
router.post("/restaurants", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const { name, location, phone, rating, reviews, openTime, description } = req.body;
    const images = (req.files || []).map((f) => f.location);
    const amenities = parseJsonArray(req.body.amenities);
    const created = await Restaurant.create({ name, location, phone, rating, reviews, openTime, description, amenities, images });
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// CITY PICTURES
router.post("/city-pictures", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { description, author } = req.body;
    
    // Sigurohu që fotoja është ngarkuar
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    const image = req.file.location; // URL-ja që vjen nga AWS S3

    const created = await CityPicture.create({
      image,
      description: String(description || ""),
      author: String(author || ""),
    });
    
    res.status(201).json(created);
  } catch (e) { 
    res.status(500).json({ message: e.message }); 
  }
});

module.exports = router;