const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");
const { testSearch } = require("../controllers/chatController");
const {
    generateEmbedding,
} = require("../services/embeddingService");

// Upload PDF - Protected
router.post(
    "/upload",
    authMiddleware,
    upload.single("pdf"),
    uploadDocument
);

// Get all documents for user - Protected
router.get(
    "/",
    authMiddleware,
    getDocuments
);

// Delete document - Protected
router.delete(
    "/:id",
    authMiddleware,
    deleteDocument
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