// src/models/Business.js
const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema(
  {
    open: { type: String, default: null },  // "08:00 AM"
    close: { type: String, default: null }, // "06:00 PM"
  },
  { _id: false }
);

const BusinessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // restaurant/market/service...
    location: { type: String, default: "" },
    description: { type: String, default: "" },

    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },

    images: { type: [String], default: [] }, // "/uploads/businesses/xyz.jpg"

    workingHours: {
      monday: { type: WorkingHoursSchema, default: () => ({}) },
      tuesday: { type: WorkingHoursSchema, default: () => ({}) },
      wednesday: { type: WorkingHoursSchema, default: () => ({}) },
      thursday: { type: WorkingHoursSchema, default: () => ({}) },
      friday: { type: WorkingHoursSchema, default: () => ({}) },
      saturday: { type: WorkingHoursSchema, default: () => ({}) },
      sunday: { type: WorkingHoursSchema, default: () => ({}) },
    },

    // optional, if you want to show rating in list
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "businesses" } // ✅ force collection name
);

module.exports = mongoose.model("Business", BusinessSchema);
