/*const multer = require("multer");
const path = require("path");
const fs = require("fs");

// backend/uploads/fauna-videos
const uploadDir = path.join(__dirname, "..", "..", "uploads", "fauna-videos");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".mp4", ".mov", ".m4v"].includes(ext) ? ext : ".mp4";
    cb(null, `fauna_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["video/mp4", "video/quicktime", "video/x-m4v"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only video files allowed (mp4/mov/m4v)"), false);
  cb(null, true);
};

const uploadFaunaVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 60 * 1024 * 1024, files: 1 }, // 60MB (ndrysho sipas nevojes)
});

module.exports = { uploadFaunaVideo };*/