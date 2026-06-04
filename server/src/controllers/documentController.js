const Document = require("../models/document");
const { extractText, createChunks } = require("../services/pdfProcessor");

const uploadDocument = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF file uploaded",
            });
        }


        const pdfData = await extractText(req.file.path);
        const chunks = await createChunks(pdfData.text);
        console.log("Pages:", pdfData.numPages);
        console.log("Total Chunks:", chunks.length);

        console.log(chunks[0]);

        if (!pdfData.text || !pdfData.text.trim()) {
            return res.status(400).json({
                success: false,
                message: "PDF contains no extractable text",
            });
        }


        const document = await Document.create({
            userId: "684000000000000000000001", // Replace after auth
            name: req.file.originalname,
            filePath: req.file.path,
            size: req.file.size,
            pageCount: pdfData.numPages,
            status: "processing",
        });

        return res.status(201).json({
            success: true,
            message: "PDF uploaded and processed successfully",
            document,
        });

    } catch (error) {
        console.error("Upload Document Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Upload failed",
        });
    }
};

module.exports = {
    uploadDocument,
};