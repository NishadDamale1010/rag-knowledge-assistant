const Document = require("../models/document");
const { extractText } = require("../services/pdfProcessor");
const {
    ingestDocument,
} = require("../services/documentIngestionService");

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

module.exports = {
    uploadDocument,
};