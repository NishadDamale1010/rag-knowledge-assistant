const fs = require("fs");
const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const fileFilter = (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
});

const handleUpload = (req, res, next) => {
    upload.single("pdf")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }
        next();
    });
};

module.exports = { upload, handleUpload, UPLOAD_DIR };
