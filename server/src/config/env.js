const { z } = require("zod");

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z
        .string()
        .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    JWT_ACCESS_EXPIRES: z.string().default("15m"),
    JWT_REFRESH_EXPIRES: z.string().default("7d"),
    CLIENT_URL: z.string().url().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    OPENROUTER_BASE_URL: z.string().url().optional(),
    GROQ_API_KEY: z.string().optional(),
    CHAT_DAILY_LIMIT: z.coerce.number().default(20),
    UPLOAD_DAILY_LIMIT: z.coerce.number().default(20),
    MAX_FILE_SIZE_MB: z.coerce.number().default(20),
});

function validateEnv() {
    if (
        process.env.NODE_ENV !== "production" &&
        !process.env.JWT_REFRESH_SECRET &&
        process.env.JWT_SECRET?.length >= 32
    ) {
        process.env.JWT_REFRESH_SECRET =
            process.env.JWT_SECRET + "_refresh_dev_key_32";
    }

    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("❌ Invalid environment variables:");
        result.error.issues.forEach((issue) => {
            console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        });
        process.exit(1);
    }

    return result.data;
}

module.exports = { validateEnv, envSchema };
