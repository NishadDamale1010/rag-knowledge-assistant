const { randomUUID } = require("crypto");
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
    const requestId = req.headers["x-request-id"] || randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);

    const start = Date.now();

    res.on("finish", () => {
        logger.info("request", {
            requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration: Date.now() - start,
            ip: req.ip,
            userId: req.user?.id,
        });
    });

    next();
};

module.exports = requestLogger;
