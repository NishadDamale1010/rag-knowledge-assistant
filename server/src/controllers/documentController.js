const Document = require("../models/document");
const Chunk = require("../models/chunk");
const { ingestDocument } = require("../services/documentIngestionService");
const { scanAndValidateUpload } = require("../services/fileSecurityService");
const { UPLOAD_DIR } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No PDF file uploaded",
            code: "NO_FILE",
        });
    }

    const duplicate = await Document.findOne({
        userId: req.user.id,
        name: req.file.originalname,
        size: req.file.size,
    });

    if (duplicate) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
            success: false,
            message: "This document has already been uploaded",
            code: "DUPLICATE_DOCUMENT",
        });
    }

    const validation = await scanAndValidateUpload(req.file.path, UPLOAD_DIR);

    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: validation.reason,
            code: "INVALID_FILE",
        });
    }

    const { pdfData } = validation;

    const document = await Document.create({
        userId: req.user.id,
        name: req.file.originalname.replace(/[^a-zA-Z0-9._\s-]/g, "_").slice(0, 255),
        filePath: validation.safePath || req.file.path,
        size: req.file.size,
        pageCount: pdfData.numPages,
        status: "processing",
    });

    try {
        const result = await ingestDocument(document._id, document.filePath);

        logger.info("document", {
            event: "upload_success",
            userId: req.user.id,
            documentId: document._id,
        });

        return res.status(201).json({
            success: true,
            message: "Document processed successfully",
            documentId: document._id,
            chunkCount: result.chunkCount,
            status: "ready",
            usage: req.usage,
        });
    } catch (error) {
        await Document.findByIdAndDelete(document._id);
        if (fs.existsSync(document.filePath)) fs.unlinkSync(document.filePath);
        throw error;
    }
});

const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find({ userId: req.user.id }).sort({
        createdAt: -1,
    });

    res.json({ success: true, documents });
});

const getDocumentFile = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: "Document not found",
        });
    }

    if (document.userId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Not authorized",
            code: "FORBIDDEN",
        });
    }

    const safePath = path.resolve(document.filePath);
    if (!fs.existsSync(safePath)) {
        return res.status(404).json({
            success: false,
            message: "PDF file not found",
        });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${document.name}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    fs.createReadStream(safePath).pipe(res);
});

const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: "Document not found",
        });
    }

    if (document.userId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Not authorized",
            code: "FORBIDDEN",
        });
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
    }

    await Chunk.deleteMany({ documentId: req.params.id });
    await Document.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Document deleted successfully" });
});

module.exports = {
    uploadDocument,
    getDocuments,
    getDocumentFile,
    deleteDocument,
};
