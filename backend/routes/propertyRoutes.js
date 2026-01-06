const express = require("express");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const router = express.Router();

const {
  getProperties,
  getPropertyById,
  listProperty,
  updateProperty,
  toggleSaveProperty,
  getSavedProperties,
  clearSavedProperties,
  deleteProperty
} = require("../controllers/propertyController");

// SAVED PROPERTIES (Specific paths first)
router.get("/saved-properties", auth, getSavedProperties);
router.delete("/clear-saved", auth, clearSavedProperties);
router.post("/save-property/:propertyId", auth, toggleSaveProperty);

// GENERAL ACTIONS
router.get("/", getProperties);
router.post("/", auth, upload.array("images", 5), listProperty);
router.put("/:id", auth, updateProperty);
router.delete("/:id", auth, deleteProperty);

// DYNAMIC DETAIL (Must be last)
router.get("/:id", getPropertyById);

module.exports = router;