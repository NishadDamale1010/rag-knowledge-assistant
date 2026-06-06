const { z } = require("zod");

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100)
        .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    email: z.string().trim().email("Invalid email").max(255).toLowerCase(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128)
        .regex(/[A-Za-z]/, "Password must contain a letter")
        .regex(/[0-9]/, "Password must contain a number"),
});

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email").max(255).toLowerCase(),
    password: z.string().min(1, "Password is required").max(128),
});

module.exports = { registerSchema, loginSchema };
