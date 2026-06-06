const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { sanitizeFilename } = require("../services/fileSecurityService");

const UPLOAD_DIR = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB) || 20;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        cb(null, sanitizeFilename(file.originalname));
    },
});

const fileFilter = (_req, file, cb) => {
    const allowedMimes = ["application/pdf", "application/x-pdf"];

    if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error("Only PDF files are allowed"), false);
    }

    if (!file.originalname.toLowerCase().endsWith(".pdf")) {
        return cb(new Error("File must have .pdf extension"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxSizeMb * 1024 * 1024,
        files: 1,
    },
});

const handleUpload = (req, res, next) => {
    upload.single("pdf")(req, res, (err) => {
        if (err) {
            const message =
                err.code === "LIMIT_FILE_SIZE"
                    ? `File exceeds ${maxSizeMb}MB limit`
                    : err.message || "File upload failed";

            return res.status(400).json({
                success: false,
                message,
                code: "UPLOAD_ERROR",
            });
        }
        next();
    });
};

module.exports = { upload, handleUpload, UPLOAD_DIR };
