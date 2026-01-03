const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ADDED: Phone number field with basic 10-digit validation
    phone: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'] 
    },
    listedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    boughtProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    rentedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    givenOnRent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);