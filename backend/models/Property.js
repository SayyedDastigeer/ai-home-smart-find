const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    
    // 🔹 Added homeType field to match your filter checkboxes
    homeType: { 
      type: String, 
      required: true,
      enum: ["Houses", "Townhomes", "Multi-family", "Condos", "Apartments", "Manufactured"],
      default: "Houses"
    },

    type: { 
      type: String, 
      enum: ["sell", "rent"], 
      required: true 
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },

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

    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);