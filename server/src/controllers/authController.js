const bcrypt = require("bcryptjs");

const User = require("../models/user");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email, and password are required",
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters",
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists",
            });
        }

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({
                name,
                email,
                passwordHash,
            });

        const token =
            generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Registration failed",
        });
    }
};
const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const user =
            await User.findOne({
                email,
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.passwordHash
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        const token =
            generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Login failed",
        });
    }
};
const getMe = async (
    req,
    res
) => {
    try {
        const user =
            await User.findById(
                req.user.id
            ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get user",
        });
    }
};
module.exports = {
    register,
    login,
    getMe,
};  
