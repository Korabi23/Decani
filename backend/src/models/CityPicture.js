const mongoose = require("mongoose");

const CityPictureSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // "/uploads/city-pictures/xxx.jpg" OR full url
    description: { type: String, default: "" },
    author: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CityPicture", CityPictureSchema);
