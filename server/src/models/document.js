const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        pageCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['processing', 'ready', 'error'],
            default: 'processing',
        },
        chunkCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ userId: 1, name: 1, size: 1 });

module.exports = mongoose.model("Document", documentSchema);