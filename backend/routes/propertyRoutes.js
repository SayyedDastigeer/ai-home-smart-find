const express = require("express");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");


// Initialize multer with Cloudinary storage
const upload = multer({ storage });

const {
  getProperties,
  getPropertyById,
  listProperty,
  buyProperty,
  rentProperty,
   getSavedProperties,
   toggleSaveProperty
} = require("../controllers/propertyController");

const router = express.Router();

// Public routes
router.get("/", getProperties);
router.get("/saved-properties", auth, getSavedProperties);
router.get("/:id", getPropertyById); // Missing route added here

// Protected routes
// upload.array("images", 5) matches the name used in your frontend FormData
router.post("/", auth, upload.array("images", 5), listProperty);
router.post("/buy/:id", auth, buyProperty);
router.post("/rent/:id", auth, rentProperty);
router.post("/save-property/:propertyId", auth, toggleSaveProperty);

module.exports = router;