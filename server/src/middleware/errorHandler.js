const logger = require("../utils/logger");

class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
    }
}

const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const isProd = process.env.NODE_ENV === "production";

    logger.error("error", {
        requestId: req.requestId,
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.originalUrl,
        userId: req.user?.id,
    });

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "Origin not allowed",
        });
    }

    res.status(statusCode).json({
        success: false,
        message: err.isOperational || !isProd ? err.message : "Something went wrong",
        code: err.code || "INTERNAL_ERROR",
        ...(err.usage && { usage: err.usage, message: err.message }),
        ...(!isProd && err.stack && { stack: err.stack }),
    });
};

module.exports = { AppError, errorHandler };
