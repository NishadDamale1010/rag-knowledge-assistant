const mongoose = require("mongoose");

const usageLimitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["chat", "upload"],
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

usageLimitSchema.index({ userId: 1, type: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("UsageLimit", usageLimitSchema);
