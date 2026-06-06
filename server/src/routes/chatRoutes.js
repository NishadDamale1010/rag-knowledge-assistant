const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const requireUsage = require("../middleware/usageMiddleware");
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
const { chatBodySchema, sessionSchema, objectId } = require("../validators/chatSchemas");
const { z } = require("zod");

const router = express.Router();

router.use(authMiddleware);

router.post("/test-search", validate(chatBodySchema), testSearch);
router.post("/ask", requireUsage("chat"), validate(chatBodySchema), askQuestion);
router.post("/stream", requireUsage("chat"), validate(chatBodySchema), streamAnswer);

router.get("/sessions", getSessions);
router.get("/sessions/:id", validate(z.object({ id: objectId }), "params"), getSession);
router.post("/sessions", validate(sessionSchema), saveSession);
router.delete("/sessions/:id", validate(z.object({ id: objectId }), "params"), deleteSession);

module.exports = router;
