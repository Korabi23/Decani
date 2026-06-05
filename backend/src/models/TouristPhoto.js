const mongoose = require("mongoose");

const TouristPhotoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    type: { type: String, default: "" }, // Natyrë / Histori / etj.
    photos: { type: [String], default: [] },
  },
  { timestamps: true, collection: "tourist_photos" }
);

module.exports = mongoose.model("TouristPhoto", TouristPhotoSchema);
