const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Publik", "Privat", "Specializuar"], default: "Publik" },
  location: { type: String, default: "" },
  schedule: { type: String, default: "" },
  beds: { type: Number, default: 0 },
  doctors: { type: Number, default: 0 },
  established: { type: Number },
  description: { type: String, default: "" },
  services: { type: [String], default: [] },
  contact: { type: String, default: "" },
  emergency: { type: String, default: "" },
  image: { type: String, default: "" }, // Mbështetje për foto në S3 si te veturat
}, { timestamps: true });

module.exports = mongoose.model("Hospital", HospitalSchema);