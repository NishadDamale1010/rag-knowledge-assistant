const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    testSearch,
    askQuestion,
    streamAnswer
} = require("../controllers/chatController");

const router = express.Router();

// Protected Routes
router.post("/test-search", authMiddleware, testSearch);
router.post("/ask", authMiddleware, askQuestion);
router.post("/stream", authMiddleware, streamAnswer);

module.exports = router;