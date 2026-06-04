const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { uploadDocument } = require("../controllers/documentController");
const { testSearch } = require("../controllers/chatController");
const {
    generateEmbedding,
} = require("../services/embeddingService");

// Upload PDF
router.post(
    "/upload",
    upload.single("pdf"),
    uploadDocument
);

// Test Embedding API
router.get("/test-embedding", async (req, res) => {
    try {
        const embedding = await generateEmbedding(
            "Hello World"
        );

        res.json({
            success: true,
            dimensions: embedding.length,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });
    }
});

// Search similar chunks
router.post("/search", testSearch);

module.exports = router;