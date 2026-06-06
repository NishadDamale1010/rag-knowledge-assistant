const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        content: { type: String, default: "" },
        sources: { type: Array, default: [] },
        timestamp: { type: Number },
        isError: { type: Boolean, default: false },
    },
    { _id: false }
);

const chatSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],
        title: {
            type: String,
            default: "New Chat",
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

chatSessionSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("ChatSession", chatSessionSchema);
