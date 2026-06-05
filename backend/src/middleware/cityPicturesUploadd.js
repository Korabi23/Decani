// backend/src/middleware/cityPicturesUpload.js
/*const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ backend/uploads/city-pictures
const uploadDir = path.join(__dirname, "..", "..", "uploads", "city-pictures");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `city_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only image files allowed (jpg/png/webp)"), false);
  cb(null, true);
};

const uploadCityPictures = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});

module.exports = { uploadCityPictures };*/