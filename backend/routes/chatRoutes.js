const express = require("express");
const router = express.Router();
const { getAiRecommendation } = require("../controllers/chatController");

router.post("/ask-ai", getAiRecommendation);

module.exports = router;