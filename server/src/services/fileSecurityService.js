const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { extractText } = require("./pdfProcessor");
const logger = require("../utils/logger");

const PDF_MAGIC = "%PDF";
const MAX_FILENAME_LENGTH = 255;

const DANGEROUS_SIGNATURES = [
    { sig: "<?xml", label: "XML" },
    { sig: "<!DOCTYPE", label: "DTD" },
    { sig: "<!ENTITY", label: "XXE entity" },
    { sig: "PK\x03\x04", label: "ZIP archive" },
];

const sanitizeFilename = (originalName) => {
    const base = path
        .basename(originalName || "document.pdf")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, MAX_FILENAME_LENGTH);

    return `${randomUUID()}.pdf`;
};

const readFileHeader = (filePath, bytes = 512) => {
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(bytes);
    const bytesRead = fs.readSync(fd, buffer, 0, bytes, 0);
    fs.closeSync(fd);
    return buffer.slice(0, bytesRead);
};

const validateMagicBytes = (filePath) => {
    const header = readFileHeader(filePath, 8);
    const headerStr = header.toString("utf8", 0, 5);

    if (!headerStr.startsWith(PDF_MAGIC)) {
        return { valid: false, reason: "File is not a valid PDF (magic bytes mismatch)" };
    }

    const headerUtf8 = header.toString("utf8");

    for (const { sig, label } of DANGEROUS_SIGNATURES) {
        if (headerUtf8.includes(sig)) {
            logger.warn("security", { event: "blocked_file_signature", label });
            return { valid: false, reason: `Blocked file type: ${label}` };
        }
    }

    return { valid: true };
};

const validatePdfStructure = async (filePath) => {
    try {
        const pdfData = await extractText(filePath);

        if (!pdfData.numPages || pdfData.numPages < 1) {
            return { valid: false, reason: "PDF has no pages" };
        }

        if (!pdfData.text?.trim()) {
            return { valid: false, reason: "PDF contains no extractable text" };
        }

        return { valid: true, pdfData };
    } catch (error) {
        return { valid: false, reason: "Invalid or corrupted PDF structure" };
    }
};

const resolveSafePath = (uploadDir, filename) => {
    const resolved = path.resolve(uploadDir, filename);
    const resolvedDir = path.resolve(uploadDir);

    if (!resolved.startsWith(resolvedDir + path.sep)) {
        throw new Error("Path traversal detected");
    }

    return resolved;
};

const scanAndValidateUpload = async (filePath, uploadDir) => {
    const safePath = resolveSafePath(uploadDir, path.basename(filePath));

    const magic = validateMagicBytes(safePath);
    if (!magic.valid) {
        fs.unlinkSync(safePath);
        return { valid: false, reason: magic.reason };
    }

    const structure = await validatePdfStructure(safePath);
    if (!structure.valid) {
        fs.unlinkSync(safePath);
        return { valid: false, reason: structure.reason };
    }

    return { valid: true, pdfData: structure.pdfData, safePath };
};

module.exports = {
    sanitizeFilename,
    validateMagicBytes,
    validatePdfStructure,
    scanAndValidateUpload,
    resolveSafePath,
};
