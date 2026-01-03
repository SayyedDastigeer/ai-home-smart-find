const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  buyerPhone: { type: String },
  buyerEmail: { type: String },
  status: { type: String, enum: ["pending", "contacted"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);