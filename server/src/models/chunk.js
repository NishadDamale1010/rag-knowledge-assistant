const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        chunkIndex: {
            type: Number,
            required: true
        },
        embedding: {
            type: [Number],
            default: []
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model('Chunk',chunkSchema);