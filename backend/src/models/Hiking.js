const mongoose = require("mongoose");

const HikingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    duration: { type: String, default: "" },
    distance: { type: String, default: "" },
    elevation: { type: String, default: "" },
    desc: { type: String, default: "" },

    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },

    images: { type: [String], default: [] },
  },
  { timestamps: true, collection: "hiking_paths" }
);

module.exports = mongoose.model("Hiking", HikingSchema);
