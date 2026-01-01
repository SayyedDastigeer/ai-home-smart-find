const express = require("express");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const {
  getProperties,
  getPropertyById,
  listProperty,
  buyProperty,
  rentProperty,
  getSavedProperties,
  toggleSaveProperty,
  clearSavedProperties,
} = require("../controllers/propertyController");

const router = express.Router();

// 1. SAVED PROPERTIES (Specific)
router.get("/saved-properties", auth, getSavedProperties);
router.delete("/clear-saved", auth, clearSavedProperties);
router.post("/save-property/:propertyId", auth, toggleSaveProperty);

// 2. PROPERTIES (General)
router.get("/", getProperties);
router.post("/", auth, upload.array("images", 5), listProperty);
router.post("/buy/:id", auth, buyProperty);
router.post("/rent/:id", auth, rentProperty);

// 3. SINGLE PROPERTY (Must be last)
router.get("/:id", getPropertyById);

module.exports = router;