const authorize = (...roles) => (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Insufficient permissions",
            code: "FORBIDDEN",
        });
    }
    next();
};

module.exports = authorize;
