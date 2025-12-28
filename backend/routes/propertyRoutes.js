const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  listProperty,
  buyProperty,
  rentProperty,
} = require("../controllers/propertyController");

const router = express.Router();

router.post("/", auth, listProperty);
router.post("/buy/:id", auth, buyProperty);
router.post("/rent/:id", auth, rentProperty);

module.exports = router;
