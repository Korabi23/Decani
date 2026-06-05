const mongoose = require("mongoose");

const WaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: "" },
    type: { type: String, default: "" },          // e.g. "Liqen", "Lumë"
    surface: { type: String, default: "" },       // e.g. "3.9 km²"
    depth: { type: String, default: "" },         // e.g. "40 m"
    coordinates: { type: String, default: "" },   // e.g. "42.64, 21.13"
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
  },
  { timestamps: true, collection: "waters" }
);

module.exports = mongoose.model("Water", WaterSchema);