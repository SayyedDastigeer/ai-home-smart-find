const express = require("express");
const auth = require("../middleware/authMiddleware");
const { sendInquiry, getOwnerInbox, replyToInquiry } = require("../controllers/inquiryController");
const router = express.Router();

router.post("/", auth, sendInquiry);
router.get("/inbox", auth, getOwnerInbox);
router.post("/reply/:id", auth, replyToInquiry); // New reply route

module.exports = router;