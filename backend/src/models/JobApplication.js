const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    // ✅ Now it's a real reference to a Job in Mongo
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

    fullName: { type: String, required: true },
    email: { type: String, required: true },

    // ✅ NEW: short code user can track with
    trackingCode: { type: String, required: true, unique: true, index: true },

    message: { type: String, default: "" },

    // ✅ Real uploaded CV URL
    cvUrl: { type: String, default: "" },

    // ✅ Admin status
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
