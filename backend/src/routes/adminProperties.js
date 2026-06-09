const express = require("express");
const Property = require("../models/Property");
const upload = require("../middleware/awsUpload");
const { requireAdmin } = require("../middleware/auth");
const { deleteFromS3 } = require("../services/s3Service");
const router = express.Router();

// GET të gjitha për admin
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Property.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

// POST krijo
router.post("/", requireAdmin, upload.array("images", 5), async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => f.location) : [];
    // Krijojmë objektin duke përfshirë edhe fushën 'image' (cover) nëse vjen nga req.body
    const prop = await Property.create({ ...req.body, images });
    res.status(201).json(prop);
  } catch (e) { next(e); }
});

// PUT (Edit)
router.put("/:id", requireAdmin, upload.array("images", 5), async (req, res, next) => {
  try {
    const { keepImages, ...body } = req.body;
    const existing = await Property.findById(req.params.id);
    
    if (!existing) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    // Fshi fotot që s'janë te 'keepImages'
    const keep = keepImages ? JSON.parse(keepImages) : [];
    const toDelete = existing.images.filter(img => !keep.includes(img));
    
    for (const url of toDelete) {
        // Përdorim URL-në siç është, por sigurohemi që e kemi çelësin e duhur
        const key = url.split(".com/").pop(); 
        if (key) await deleteFromS3(key);
    }

    const newImages = req.files ? req.files.map(f => f.location) : [];
    
    // Përditësojmë me imazhet e mbajtura + të rejat
    const updated = await Property.findByIdAndUpdate(req.params.id, {
      ...body,
      images: [...keep, ...newImages]
    }, { new: true });
    
    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Property.findByIdAndDelete(req.params.id);
    if (item && item.images && Array.isArray(item.images)) {
        for (const url of item.images) {
            const key = url.split(".com/").pop();
            if (key) await deleteFromS3(key);
        }
    }
    res.json({ message: "Deleted successfully" });
  } catch (e) { next(e); }
});

module.exports = router;