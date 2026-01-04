const express = require("express");
const { signup, login } = require("../controllers/authController");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.delete("/delete-account", auth, async (req, res) => {
  try {
    // Triggers the 'pre' hook in User.js
    const user = await User.findOneAndDelete({ _id: req.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Account and related data deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;