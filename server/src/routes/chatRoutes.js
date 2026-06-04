const express = require("express");

const {
    testSearch,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/test-search", testSearch);

module.exports = router;