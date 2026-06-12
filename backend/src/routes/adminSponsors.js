const express = require("express");
const Sponsor = require("../models/Sponsor");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/awsUpload");
const { deleteFromS3 } = require("../services/s3Service");
const router = express.Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const list = await Sponsor.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });
    const created = await Sponsor.create({ name: req.body.name, image: req.file.location });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Sponsor.findByIdAndDelete(req.params.id);
    if (deleted?.image?.includes(".com/")) await deleteFromS3(deleted.image.split(".com/")[1]);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});
module.exports = router;