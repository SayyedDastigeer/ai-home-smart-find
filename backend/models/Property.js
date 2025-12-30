const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["sell", "rent"], required: true },
    // Added fields for search filtering
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    images: [String],
    description: String,
    amenities: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);