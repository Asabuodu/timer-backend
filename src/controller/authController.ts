


// import { Request, Response } from "express";
import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dbConnect from "../lib/mongoose";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

// Signup controller
export const signup: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || password.length < 6) {
      res.status(400).json({ error: "All fields required. Password must be 6+ chars." });
      return;
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login controller
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Forgot password: Send token to user's email
export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await bcrypt.hash(token, 10);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset Token",
      text: `Your password reset token is: ${token}`,
    });

    res.status(200).json({ message: "Token sent to your email" });
  } catch (err) {
  console.error("Forgot password error:", err);  // 🔍 log the real issue
  res.status(500).json({ message: "Server error" });
}

};


// Verify reset token
export const forgotPasswordToken: RequestHandler = async (req, res) => {
  const { email } = req.body;
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 1000 * 60 * 3;

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Reset Code",
    text: `Your reset code is: ${token}, This code is valid for 3 minutes.`,
  });

  res.status(200).json({ message: "Reset token sent to email" });
};


// Verify reset token
export const verifyResetToken: RequestHandler = async (req, res) => {
  const { email, token } = req.body;
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpiry) {
    res.status(400).json({ error: "Invalid or expired token" });
    return;
  }

  res.status(200).json({ message: "Token verified" });
};

export const verifyToken: RequestHandler = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid || user.resetTokenExpiry < Date.now()) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const resetJwt = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "3m",
    });

    res.status(200).json({ message: "Token verified", token: resetJwt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

// In authController.ts
export const resetPassword: RequestHandler = async (req, res) => {
  const { password, token } = req.body;

  try {
    await dbConnect();
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
};

