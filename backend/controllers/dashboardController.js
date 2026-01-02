const Property = require("../models/Property");
const User = require("../models/User");
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("name email savedProperties").lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const [listedCount, boughtCount, rentedCount, givenOnRentCount] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Property.countDocuments({ buyer: userId }),
      Property.countDocuments({ renter: userId }),
      Property.countDocuments({ owner: userId, status: "rented" }),
    ]);

    res.json({
      name: user.name,
      email: user.email,
      listedCount,
      boughtCount,
      rentedCount,
      givenOnRentCount,
      savedCount: user.savedProperties ? user.savedProperties.length : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};