const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    badgeText: { type: String, default: "" },
    badgeTint: { type: String, default: "" },
    badgeColor: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

const MountainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },

    locationName: { type: String, default: "Deçan" },
    latitude: { type: Number, default: 42.5428 },
    longitude: { type: Number, default: 20.2781 },

    altitude: { type: String, default: "" },
    climate: { type: String, default: "" },
    attractions: { type: String, default: "" },

    visits: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    images: { type: [String], default: [] },

    stops: { type: [StopSchema], default: [] },
  },
  { timestamps: true, collection: "mountains" }
);

module.exports = mongoose.model("Mountain", MountainSchema);