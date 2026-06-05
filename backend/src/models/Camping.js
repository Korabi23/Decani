const mongoose = require("mongoose");

const CampingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    location: { type: String, default: "" },
    mountain: { type: String, default: "" },

    price: { type: Number, default: 0 },
    surface: { type: String, default: "" },
    capacity: { type: String, default: "" },
    rooms: { type: String, default: "" },
    coordinates: { type: String, default: "" },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    phone: { type: String, default: "" },   // optional
    whatsapp: { type: String, default: "" },// optional

    // images
    coverImage: { type: String, default: "" }, // "/uploads/camping/xxx.jpg"
    images: { type: [String], default: [] },   // ["/uploads/camping/a.jpg", ...]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Camping", CampingSchema);