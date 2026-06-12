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

router.get("/job-applications", requireAdmin, async (req, res, next) => {
  try {
    const apps = await JobApplication.find()
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (e) {
    next(e);
  }
});


router.patch("/job-applications/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "reviewed", "accepted", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("jobId");

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});


router.post("/seed-jobs", requireAdmin, async (req, res, next) => {
  try {
    const jobsToSeed = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€45,000 - €60,000",
        description:
          "Join our dynamic team to build cutting-edge web applications using React and modern technologies.",
        requirements: ["React", "JavaScript/TypeScript", "REST APIs"],
        perks: ["Remote option", "Training", "Competitive salary"],
      },
      {
        title: "Marketing Specialist",
        company: "Creative Agency Pro",
        location: "Prishtinë",
        type: "Part-time",
        salary: "€25,000 - €35,000",
        description:
          "Drive brand awareness and lead generation through innovative digital marketing campaigns.",
        requirements: ["Social media", "Content strategy", "Analytics"],
        perks: ["Flexible hours", "Growth opportunities"],
      },
      {
        title: "UX/UI Designer",
        company: "Design Studio Alpha",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€40,000 - €55,000",
        description:
          "Create beautiful and intuitive user experiences for mobile and web applications.",
        requirements: ["Figma", "UX research", "Prototyping"],
        perks: ["Creative team", "Modern tools"],
      },
      {
        title: "Data Analyst",
        company: "Analytics Hub",
        location: "Prishtinë",
        type: "Part-time",
        salary: "€30,000 - €42,000",
        description:
          "Transform complex data into actionable insights to drive business decisions and growth.",
        requirements: ["Excel/Sheets", "SQL basics", "Reporting"],
        perks: ["Flexible schedule", "Learning budget"],
      },
      {
        title: "Project Manager",
        company: "Innovation Labs",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€50,000 - €70,000",
        description:
          "Lead cross-functional teams to deliver high-impact projects on time and within budget.",
        requirements: ["Communication", "Planning", "Leadership"],
        perks: ["Bonus", "Career growth"],
      },
      {
        title: "Punëtor Ndërtimi",
        company: "Decani Construction",
        location: "Deçan",
        type: "Full-time",
        salary: "Sipas marrëveshjes",
        description: "Kërkojmë punëtorë për projekte ndërtimi.",
        requirements: ["Përvojë e preferuar", "Përgjegjës", "Puntor"],
        perks: ["Transport", "Pagë e rregullt"],
      },
      {
        title: "Asistent Administrativ",
        company: "Komuna",
        location: "Deçan",
        type: "Full-time",
        salary: "500€",
        description: "Përkrahje administrative për zyrë.",
        requirements: ["MS Office", "Komunikim i mirë"],
        perks: ["Kontratë", "Trajnim"],
      },
    ];

    const existing = await Job.find({}, { title: 1, company: 1 }).lean();
    const existingSet = new Set(existing.map((j) => `${j.title}__${j.company}`));

    const toInsert = jobsToSeed.filter(
      (j) => !existingSet.has(`${j.title}__${j.company}`)
    );

    if (toInsert.length === 0) {
      return res.json({ message: "Nothing new to seed ✅" });
    }

    await Job.insertMany(toInsert);

    return res.json({ message: `Seeded ${toInsert.length} new jobs ✅` });
  } catch (e) {
    next(e);
  }
});


router.get("/jobs", requireAdmin, async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) {
    next(e);
  }
});


router.post("/jobs", requireAdmin, async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements = [],
      perks = [],
      faqs = [],
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: "title and company are required" });
    }

    const created = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      perks,
      faqs,
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.patch("/jobs/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});


router.delete("/jobs/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted ✅" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;