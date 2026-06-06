const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const requireUsage = require("../middleware/usageMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const {
    uploadDocument,
    getDocuments,
    getDocumentFile,
    deleteDocument,
} = require("../controllers/documentController");
const { documentIdParam } = require("../validators/documentSchemas");

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", requireUsage("upload"), handleUpload, uploadDocument);
router.get("/", getDocuments);
router.get("/:id/file", validate(documentIdParam, "params"), getDocumentFile);
router.delete("/:id", validate(documentIdParam, "params"), deleteDocument);

module.exports = router;
