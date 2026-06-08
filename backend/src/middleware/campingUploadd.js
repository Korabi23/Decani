/*src/middleware/campingUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// This file is in backend/src/middleware, so go to backend/uploads/camping
const uploadDir = path.join(__dirname, "..", "..", "uploads", "camping");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `camp_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only image files allowed (jpg/png/webp)"), false);
  cb(null, true);
};

const uploadCamping = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
    files: 10, // cover + gallery
  },
});

// coverImage: 1 file
// images: up to 6 files
const campingFields = uploadCamping.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

module.exports = { campingFields };*/