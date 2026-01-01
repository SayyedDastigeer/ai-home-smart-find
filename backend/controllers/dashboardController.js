const Property = require("../models/Property");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // USER BASIC INFO
    const user = await User.findById(userId)
      .select("name email savedProperties")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 REAL COUNTS FROM PROPERTY COLLECTION
    const [
      listedCount,
      boughtCount,
      rentedCount,
      givenOnRentCount,
    ] = await Promise.all([
      // Properties THIS USER listed
      Property.countDocuments({ owner: userId }),

      // Properties THIS USER bought
      Property.countDocuments({ buyer: userId }),

      // Properties THIS USER rented
      Property.countDocuments({ renter: userId }),

      // Properties THIS USER gave on rent
      Property.countDocuments({ owner: userId, status: "rented" }),
    ]);

    res.json({
      name: user.name,
      email: user.email,
      listedCount,
      boughtCount,
      rentedCount,
      givenOnRentCount,
      savedCount: user.savedProperties.length,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
