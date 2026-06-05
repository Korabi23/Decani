/*const path = require("path");
const multer = require("multer");
const fs = require("fs");

// 📁 Upload folder
const uploadDir = path.join(__dirname, "..", "..", "uploads", "businesses");
fs.mkdirSync(uploadDir, { recursive: true });

// 💾 Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();

    // only safe extensions
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const safeExt = allowedExt.includes(ext) ? ext : ".jpg";

    const uniqueName = `biz_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, uniqueName);
  },
});

// 🔍 File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedMime = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
  }
};

// 🚀 Multer config
const uploadBusinessImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // ✅ 15MB per image (fix for phone images)
    files: 8, // max 8 images
  },
});

// export
module.exports = { uploadBusinessImages };*/