const express = require("express");

const {
    testSearch,
    askQuestion
} = require("../controllers/chatController");

const router = express.Router();

router.post("/test-search", testSearch);
router.post("/ask", askQuestion);

module.exports = router;