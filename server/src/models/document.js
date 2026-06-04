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
        size: {
            type: Number,
            required: true,
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


    }, { timestamps: true })

module.exports = mongoose.model('Document' , documentSchema);