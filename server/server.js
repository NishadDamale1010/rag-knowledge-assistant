require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const { validateEnv } = require("./src/config/env");
const { corsOptions } = require("./src/config/cors");
const connectDB = require("./src/config/db");
const requestLogger = require("./src/middleware/requestLogger");
const { errorHandler } = require("./src/middleware/errorHandler");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const logger = require("./src/utils/logger");

validateEnv();

const app = express();

app.set("trust proxy", 1);

app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production",
    crossOriginEmbedderPolicy: false,
}));

app.use(cors(corsOptions));
app.use(hpp());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
        logger.warn("security", {
            event: "nosql_injection_blocked",
            key,
            path: req.originalUrl,
        });
    },
}));

app.use(requestLogger);
app.use("/api", apiLimiter);

connectDB();

const authRoutes = require("./src/routes/authRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const documentRoutes = require("./src/routes/documentRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/documents", documentRoutes);

// Backward compatibility (deprecated — use /api/v1)
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Knowva API is running",
        version: "v1",
    });
});

app.get("/health", (_req, res) => {
    res.json({ success: true, status: "healthy" });
});

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        code: "NOT_FOUND",
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger.info("Server closed");
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
    logger.error("unhandledRejection", { message: err.message, stack: err.stack });
});

process.on("uncaughtException", (err) => {
    logger.error("uncaughtException", { message: err.message, stack: err.stack });
    shutdown("uncaughtException");
});
