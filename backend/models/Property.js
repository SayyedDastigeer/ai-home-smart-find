const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    price: Number,
    type: { type: String, enum: ["sell", "rent"], required: true },

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
