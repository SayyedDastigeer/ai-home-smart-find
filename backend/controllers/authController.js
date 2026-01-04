const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP: Register new user with phone number
exports.signup = async (req, res) => {
  console.log("Incoming Signup Data:", req.body); // Debug log to check if phone arrives

  const { name, email, password, phone } = req.body;

  // Validate all required fields
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields (Name, Email, Password, Phone) are required" });
  }

  try {
    // Check for existing user by email OR phone
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    // Hash password with a salt round of 12 for high security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone, // Store phone number as String
    });

    console.log("User successfully created in MongoDB:", user);

    // Generate token so the user is logged in immediately after signup
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Mongoose Signup Error:", err.message); // Look for validation or unique index errors
    res.status(500).json({ message: "Database error: " + err.message });
  }
};

// LOGIN: Authenticate user and return data
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // Include phone so it can be used on the frontend
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error during login" });
  }
};