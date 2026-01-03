const express = require("express");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });
const {
  // ... other functions
  updateProperty // Add this
} = require("../controllers/propertyController");

const {
  getProperties,
  getPropertyById,
  listProperty,
  toggleSaveProperty,
  getSavedProperties,
  clearSavedProperties,
  deleteProperty
} = require("../controllers/propertyController");

const router = express.Router();

// ---------------------------------------------------------
// 1. SAVED PROPERTY MANAGEMENT (Specific Routes First)
// ---------------------------------------------------------

// GET /api/properties/saved-properties -> Fetch user wishlist
router.get("/saved-properties", auth, getSavedProperties);

// DELETE /api/properties/clear-saved -> Wipe entire wishlist
router.delete("/clear-saved", auth, clearSavedProperties);

// POST /api/properties/save-property/:propertyId -> Toggle save status
router.post("/save-property/:propertyId", auth, toggleSaveProperty);

router.put("/:id", auth, updateProperty);

// ---------------------------------------------------------
// 2. GENERAL LISTING ACTIONS
// ---------------------------------------------------------

// GET /api/properties -> Public search and Dashboard filtering
router.get("/", getProperties);

// POST /api/properties -> Create new listing (with Cloudinary upload)
router.post("/", auth, upload.array("images", 5), listProperty);

// DELETE /api/properties/:id -> Owner deactivates/removes listing
router.delete("/:id", auth, deleteProperty);


// ---------------------------------------------------------
// 3. PROPERTY DETAILS (Dynamic ID - Must be LAST)
// ---------------------------------------------------------

// GET /api/properties/:id -> Fetch single listing details
router.get("/:id", getPropertyById);

module.exports = router;