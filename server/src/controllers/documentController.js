const Document = require('../models/document');
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const document = await Document.create({
            userId: "684000000000000000000001", // temporary
            name: req.file.originalname,
            size: req.file.size,
            status: "processing",
        });

        res.status(201).json({
            success: true,
            message: "PDF uploaded successfully",
            document,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};

module.exports = {
    uploadDocument,
};