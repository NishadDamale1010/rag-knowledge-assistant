const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    getRefreshCookieOptions,
} = require("../utils/tokenService");
const { getAllUsage } = require("../services/usageLimitService");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const setAuthCookies = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
};

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
            code: "USER_EXISTS",
        });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        passwordHash,
        role: "user",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(user._id, {
        refreshTokenHash: hashToken(refreshToken),
    });

    setAuthCookies(res, refreshToken);

    logger.info("security", { event: "user_registered", userId: user._id });

    res.status(201).json({
        success: true,
        token: accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
        logger.warn("security", { event: "failed_login", email, ip: req.ip });
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            code: "INVALID_CREDENTIALS",
        });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        logger.warn("security", { event: "failed_login", email, ip: req.ip });
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            code: "INVALID_CREDENTIALS",
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(user._id, {
        refreshTokenHash: hashToken(refreshToken),
    });

    setAuthCookies(res, refreshToken);

    res.json({
        success: true,
        token: accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Refresh token missing",
            code: "NO_REFRESH_TOKEN",
        });
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(token);
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
            code: "INVALID_REFRESH_TOKEN",
        });
    }

    const user = await User.findById(decoded.id).select("+refreshTokenHash");
    if (!user || user.refreshTokenHash !== hashToken(token)) {
        return res.status(401).json({
            success: false,
            message: "Session expired",
            code: "SESSION_EXPIRED",
        });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(user._id, {
        refreshTokenHash: hashToken(newRefreshToken),
    });

    setAuthCookies(res, newRefreshToken);

    res.json({
        success: true,
        token: accessToken,
    });
});

const logout = asyncHandler(async (req, res) => {
    if (req.user?.id) {
        await User.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });
    }

    res.clearCookie("refreshToken", getRefreshCookieOptions());

    res.json({ success: true, message: "Logged out" });
});

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const usage = await getAllUsage(req.user.id);

    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        usage,
    });
});

const getUsage = asyncHandler(async (req, res) => {
    const usage = await getAllUsage(req.user.id);
    res.json({ success: true, usage });
});

module.exports = { register, login, refresh, logout, getMe, getUsage };
