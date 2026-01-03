const express = require("express");
const auth = require("../middleware/authMiddleware");
const { sendInquiry, getOwnerInbox } = require("../controllers/inquiryController");

const router = express.Router();

// POST /api/inquiries -> Buyer sends inquiry
router.post("/", auth, sendInquiry);

// GET /api/inquiries/inbox -> Owner views leads
router.get("/inbox", auth, getOwnerInbox);

module.exports = router;