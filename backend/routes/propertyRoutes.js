const express = require("express");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");

// Initialize multer with Cloudinary storage configuration
const upload = multer({ storage });

const {
  getProperties,
  listProperty,
  buyProperty,
  rentProperty,
} = require("../controllers/propertyController");

const router = express.Router();

/**
 * @route   GET /api/properties
 * @desc    Fetch all properties with dynamic filters (Price, Type, etc.)
 * @access  Public
 */
router.get("/", getProperties);

/**
 * @route   POST /api/properties
 * @desc    Create a new property listing with up to 5 images
 * @access  Protected (Auth + Multer Middleware)
 */
router.post("/", auth, upload.array("images", 5), listProperty);

/**
 * @route   POST /api/properties/buy/:id
 * @desc    Process property purchase
 * @access  Protected
 */
router.post("/buy/:id", auth, buyProperty);

/**
 * @route   POST /api/properties/rent/:id
 * @desc    Process property rental
 * @access  Protected
 */
router.post("/rent/:id", auth, rentProperty);

module.exports = router;