const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    type: { type: String, default: "Full-time" },
    salary: { type: String, default: "" },
    description: { type: String, default: "" },
    requirements: [{ type: String }],
    perks: [{ type: String }],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
