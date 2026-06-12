const mongoose = require('mongoose');

const VideoAdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Shto emrin e koleksionit manualisht si argument të tretë
module.exports = mongoose.model('VideoAd', VideoAdSchema, 'videoads');