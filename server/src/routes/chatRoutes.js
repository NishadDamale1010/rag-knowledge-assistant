const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    testSearch,
    askQuestion,
    streamAnswer,
} = require("../controllers/chatController");

const {
    getSessions,
    getSession,
    saveSession,
    deleteSession,
} = require("../controllers/chatHistoryController");

const router = express.Router();

router.post("/test-search", authMiddleware, testSearch);
router.post("/ask", authMiddleware, askQuestion);
router.post("/stream", authMiddleware, streamAnswer);

router.get("/sessions", authMiddleware, getSessions);
router.get("/sessions/:id", authMiddleware, getSession);
router.post("/sessions", authMiddleware, saveSession);
router.delete("/sessions/:id", authMiddleware, deleteSession);

module.exports = router;
