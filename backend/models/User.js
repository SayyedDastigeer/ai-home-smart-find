const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

// CASCADE DELETE: Triggers when User.findOneAndDelete is called
userSchema.pre('findOneAndDelete', async function(next) {
  const userId = this.getQuery()._id;
  try {
    // Delete properties and inquiries linked to this user
    await mongoose.model("Property").deleteMany({ owner: userId });
    await mongoose.model("Inquiry").deleteMany({ 
      $or: [{ sender: userId }, { receiver: userId }] 
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);