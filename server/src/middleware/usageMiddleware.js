const { checkAndIncrement } = require("../services/usageLimitService");
const asyncHandler = require("../utils/asyncHandler");

const requireUsage = (type) =>
    asyncHandler(async (req, res, next) => {
        const usage = await checkAndIncrement(req.user.id, type);
        req.usage = usage;
        res.setHeader("X-RateLimit-Remaining", usage.remaining);
        next();
    });

module.exports = requireUsage;
