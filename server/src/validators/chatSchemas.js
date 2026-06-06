const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid document ID");

const chatBodySchema = z
    .object({
        question: z
            .string()
            .trim()
            .min(1, "Question is required")
            .max(2000, "Question too long"),
        documentId: objectId.optional(),
        documentIds: z.array(objectId).max(20).optional(),
    })
    .refine((data) => data.documentId || data.documentIds?.length, {
        message: "At least one document is required",
    });

const sessionSchema = z.object({
    sessionId: objectId.optional(),
    documentIds: z.array(objectId).max(20).optional(),
    title: z.string().trim().max(200).optional(),
    messages: z
        .array(
            z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().max(50000),
                sources: z.array(z.any()).optional(),
                timestamp: z.number().optional(),
                isError: z.boolean().optional(),
            })
        )
        .min(1),
});

module.exports = { chatBodySchema, sessionSchema, objectId };
