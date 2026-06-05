// src/models/Property.js
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true }, // house/apartment/land/car/others
    listing: { type: String, required: true, trim: true },  // sale/rent

    title: { type: String, required: true, trim: true },
    price: { type: String, default: "" },
    desc: { type: String, default: "" },
    location: { type: String, default: "" },

    phone: { type: String, default: "" },

    // uploaded images (public URLs)
    images: { type: [String], default: [] },
    image: { type: String, default: "" }, // cover image (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
