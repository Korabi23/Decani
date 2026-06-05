const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, default: "House" },
    listingType: { type: String, default: "Sale" },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    images: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
