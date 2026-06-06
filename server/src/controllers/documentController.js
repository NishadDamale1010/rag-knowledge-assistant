const Document = require("../models/document");
const { extractText } = require("../services/pdfProcessor");
const {
    ingestDocument,
} = require("../services/documentIngestionService");
const Chunk = require("../models/chunk");
const fs = require("fs");

const uploadDocument = async (req, res) => {
    try {
        // Check file upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF file uploaded",
            });
        }

        // Extract PDF text for validation
        const pdfData = await extractText(req.file.path);

        console.log("Pages:", pdfData.numPages);
        console.log("Text Length:", pdfData.text.length);

        // Validate text exists
        if (!pdfData.text || !pdfData.text.trim()) {
            return res.status(400).json({
                success: false,
                message: "PDF contains no extractable text",
            });
        }

        // Create document record
        const document = await Document.create({
            userId: req.user.id,
            name: req.file.originalname,
            filePath: req.file.path,
            size: req.file.size,
            pageCount: pdfData.numPages,
            status: "processing",
        });

        // Ingest document
        const result = await ingestDocument(
            document._id,
            req.file.path
        );

        return res.status(201).json({
            success: true,
            message: "Document processed successfully",
            documentId: document._id,
            chunkCount: result.chunkCount,
            status: "ready",
        });

    } catch (error) {
        console.error(
            "Upload Document Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message || "Upload failed",
        });
    }
};

const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find(
            { userId: req.user.id }
        ).sort({ createdAt: -1 });

        res.json({
            success: true,
            documents,
        });
    } catch (error) {
        console.error("Get Documents Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch documents",
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Find document
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        // Check ownership
        if (document.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this document",
            });
        }

        // Delete file if it exists
        if (document.filePath && fs.existsSync(document.filePath)) {
            try {
                fs.unlinkSync(document.filePath);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

        // Delete associated chunks
        await Chunk.deleteMany({ documentId: id });

        // Delete document
        await Document.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("Delete Document Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete document",
        });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
};