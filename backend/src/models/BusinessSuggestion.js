const mongoose = require("mongoose");

const BusinessSuggestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    submittedByName: { type: String, default: "" },
    submittedByEmail: { type: String, default: "" },
    status: { type: String, default: "new" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessSuggestion", BusinessSuggestionSchema);
