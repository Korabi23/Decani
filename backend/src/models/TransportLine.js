const mongoose = require("mongoose");

const TransportLineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    scheduleForward: [{ type: String }],
    scheduleBackward: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransportLine", TransportLineSchema);
