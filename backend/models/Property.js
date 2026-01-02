const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    price: Number,
    type: { type: String, enum: ["sell", "rent"] },

    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    images: [String],
    amenities: [String],
    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
 // ... existing fields
    type: { type: String, enum: ["sell", "rent"] }, 
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
// ...
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
