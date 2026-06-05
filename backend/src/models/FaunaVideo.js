const mongoose = require("mongoose");

const FaunaVideoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    animal: { type: String, default: "" },
    emoji: { type: String, default: "🦌" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },

    video: { type: String, required: true }, // "/uploads/fauna-videos/xxx.mp4"
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FaunaVideo", FaunaVideoSchema);