const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Array of messages to create a chat thread
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ["pending", "contacted", "closed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);