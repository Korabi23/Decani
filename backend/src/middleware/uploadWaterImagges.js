/*const path = require("path");
const multer = require("multer");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "waters");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
      ? ext
      : ".jpg";
    cb(null, `water_${Date.now()}_${Math.random()}${safeExt}`);
  },
});

const uploadWaterImages = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 10 },
});

module.exports = { uploadWaterImages };*/