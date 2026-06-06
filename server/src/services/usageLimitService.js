const UsageLimit = require("../models/usageLimit");
const { AppError } = require("../middleware/errorHandler");

const getToday = () => new Date().toISOString().slice(0, 10);

const getUsage = async (userId, type) => {
    const limit =
        type === "chat"
            ? Number(process.env.CHAT_DAILY_LIMIT) || 20
            : Number(process.env.UPLOAD_DAILY_LIMIT) || 20;

    const record = await UsageLimit.findOne({
        userId,
        type,
        date: getToday(),
    });

    const used = record?.count || 0;

    return {
        used,
        limit,
        remaining: Math.max(0, limit - used),
    };
};

const getAllUsage = async (userId) => ({
    chat: await getUsage(userId, "chat"),
    upload: await getUsage(userId, "upload"),
});

const checkAndIncrement = async (userId, type) => {
    const usage = await getUsage(userId, type);

    if (usage.used >= usage.limit) {
        const err = new AppError(
            `Daily ${type} limit reached (${usage.limit}/${usage.limit}). Resets in 24 hours.`,
            429,
            "DAILY_LIMIT_EXCEEDED"
        );
        err.usage = { used: usage.limit, limit: usage.limit, remaining: 0 };
        throw err;
    }

    const record = await UsageLimit.findOneAndUpdate(
        { userId, type, date: getToday() },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
    );

    const used = record.count;
    const limit = usage.limit;

    return {
        used,
        limit,
        remaining: Math.max(0, limit - used),
    };
};

module.exports = { getUsage, getAllUsage, checkAndIncrement };
