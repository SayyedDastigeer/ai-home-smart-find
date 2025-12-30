const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Essential arrays for tracking user-property relationships
    listedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    boughtProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    rentedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    givenOnRent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);