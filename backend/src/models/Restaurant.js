const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    openTime: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true, collection: "restaurants" }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
