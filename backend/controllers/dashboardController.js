const Property = require("../models/Property");
const User = require("../models/User");
const Inquiry = require("../models/Inquiry"); // Import Inquiry model

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("name email savedProperties").lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const [activeListingsCount, totalInquiriesCount, myListings] = await Promise.all([
      Property.countDocuments({ owner: userId, status: "available" }),
      Inquiry.countDocuments({ owner: userId }), // Total leads
      Property.find({ owner: userId }).sort({ createdAt: -1 }), // For listing management
    ]);

    res.json({
      name: user.name,
      email: user.email,
      activeListingsCount,
      totalInquiriesCount,
      myListings,
      savedCount: user.savedProperties ? user.savedProperties.length : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard statistics" });
  }
};