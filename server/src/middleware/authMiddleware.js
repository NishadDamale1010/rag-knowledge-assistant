const { verifyAccessToken } = require("../utils/tokenService");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
                code: "UNAUTHORIZED",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);

        req.user = {
            id: decoded.id,
            role: decoded.role || "user",
        };

        next();
    } catch (error) {
        logger.warn("security", { event: "invalid_token", ip: req.ip });
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            code: "INVALID_TOKEN",
        });
    }
};

module.exports = authMiddleware;
