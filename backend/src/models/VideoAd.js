const mongoose = require('mongoose');

const VideoAdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Linku nga AWS S3
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoAd', VideoAdSchema);