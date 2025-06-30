"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyToken = exports.verifyResetToken = exports.forgotPasswordToken = exports.forgotPassword = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// Signup controller
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password || password.length < 6) {
            res.status(400).json({ error: "All fields required. Password must be 6+ chars." });
            return;
        }
        await (0, mongoose_1.default)();
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Email already registered" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await User_1.default.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.signup = signup;
// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        await (0, mongoose_1.default)();
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.login = login;
// Forgot password: Send token to user's email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedToken = await bcryptjs_1.default.hash(token, 10);
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();
        await (0, sendEmail_1.default)({
            to: email,
            subject: "Password Reset Token",
            text: `Your password reset token is: ${token}`,
        });
        res.status(200).json({ message: "Token sent to your email" });
    }
    catch (err) {
        console.error("Forgot password error:", err); // 🔍 log the real issue
        res.status(500).json({ message: "Server error" });
    }
};
exports.forgotPassword = forgotPassword;
// Verify reset token
const forgotPasswordToken = async (req, res) => {
    const { email } = req.body;
    await (0, mongoose_1.default)();
    const user = await User_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 1000 * 60 * 3;
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();
    await (0, sendEmail_1.default)({
        to: user.email,
        subject: "Reset Code",
        text: `Your reset code is: ${token}, This code is valid for 3 minutes.`,
    });
    res.status(200).json({ message: "Reset token sent to email" });
};
exports.forgotPasswordToken = forgotPasswordToken;
// Verify reset token
const verifyResetToken = async (req, res) => {
    const { email, token } = req.body;
    await (0, mongoose_1.default)();
    const user = await User_1.default.findOne({ email });
    if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpiry) {
        res.status(400).json({ error: "Invalid or expired token" });
        return;
    }
    res.status(200).json({ message: "Token verified" });
};
exports.verifyResetToken = verifyResetToken;
const verifyToken = async (req, res) => {
    const { email, token } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(token, user.resetToken);
        if (!isValid || user.resetTokenExpiry < Date.now()) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const resetJwt = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3m",
        });
        res.status(200).json({ message: "Token verified", token: resetJwt });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Verification failed" });
    }
};
exports.verifyToken = verifyToken;
// In authController.ts
const resetPassword = async (req, res) => {
    const { password, token } = req.body;
    try {
        await (0, mongoose_1.default)();
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        user.password = hashed;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: "Invalid or expired reset token" });
    }
};
exports.resetPassword = resetPassword;
