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

// --------------------
// SAVED PROPERTIES
// --------------------
router.get("/saved-properties", auth, getSavedProperties);
router.delete("/clear-saved", auth, clearSavedProperties);
router.post("/save-property/:propertyId", auth, toggleSaveProperty);

// --------------------
// PROPERTIES
// --------------------
router.get("/", getProperties);
router.post("/", auth, upload.array("images", 5), listProperty);
router.post("/buy/:id", auth, buyProperty);
router.post("/rent/:id", auth, rentProperty);

// --------------------
// SINGLE PROPERTY (ALWAYS LAST)
// --------------------
router.get("/:id", getPropertyById);

module.exports = router;
