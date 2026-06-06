const getAllowedOrigins = () => {
    const origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://rag-knowledge-assistant-omega.vercel.app",
    ];

    if (process.env.CLIENT_URL) {
        origins.push(process.env.CLIENT_URL);
    }

    return [...new Set(origins)];
};

const corsOptions = {
    origin(origin, callback) {
        const allowed = getAllowedOrigins();

        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID", "X-RateLimit-Remaining"],
    maxAge: 600,
};

module.exports = { corsOptions, getAllowedOrigins };
