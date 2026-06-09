// src/middleware/uploadPropertyImages.js
/*const path = require("path");
const multer = require("multer");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "properties");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `prop_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Only image files are allowed (jpg/png/webp)."), ok);
};

const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024, files: 10 },
});

module.exports = { uploadPropertyImages };*/
