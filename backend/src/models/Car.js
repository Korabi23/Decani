const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    description: { type: String, default: "" },
    author: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);