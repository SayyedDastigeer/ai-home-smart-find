const Property = require("../models/Property");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("name email savedProperties").lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Precise counts based on specific status and roles
    const [listedCount, boughtCount, rentedCount, givenOnRentCount] = await Promise.all([
      // Total properties listed by the user (regardless of status)
      Property.countDocuments({ owner: userId }),
      // Properties successfully purchased by the user
      Property.countDocuments({ buyer: userId, status: "sold" }),
      // Properties currently rented by the user
      Property.countDocuments({ renter: userId, status: "rented" }),
      // Properties owned by user that are currently occupied by a tenant (Income source)
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
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Failed to load dashboard statistics" });
  }
};