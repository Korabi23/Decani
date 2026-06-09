const express = require("express");
const Water = require("../models/Water");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload"); 
const { deleteFromS3 } = require("../services/s3Service");

const router = express.Router();

// GET: Lista e ujërave për admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Water.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST: Shto ujë/burim të ri
router.post("/", requireAdmin, upload.array("photos", 5), async (req, res, next) => {
  try {
    // Shtova logim për të parë nëse serveri po merr ndonjë file
    console.log("Files të marra:", req.files);
    console.log("Body i marrë:", req.body);

    // Kontroll i sigurt: nese req.files është undefined, cakto array bosh
    const files = req.files || [];
    const photos = files.map(f => f.location);

    const created = await Water.create({
      ...req.body,
      photos: photos
    });
    
    res.status(201).json(created);
  } catch (e) { 
    console.error("Gabim gjatë POST:", e);
    next(e); 
  }
});

// DELETE: Fshi dhe pastro nga S3
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Water.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Fshirja nga S3 vetëm nëse ka foto
    if (Array.isArray(item.photos) && item.photos.length > 0) {
      for (const url of item.photos) {
        try {
          // Përdorim split për të marrë vetëm pjesën e çelësit (key)
          const key = url.split(".com/")[1];
          if (key) await deleteFromS3(key);
        } catch (s3Err) {
          console.error("Gabim gjatë fshirjes nga S3:", s3Err);
          // Vazhdojmë me fshirjen në DB edhe nëse S3 dështon
        }
      }
    }
    res.json({ message: "Deleted ✅" });
  } catch (e) { next(e); }
});

module.exports = router;