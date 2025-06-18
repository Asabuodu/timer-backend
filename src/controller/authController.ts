// import { Request, Response } from "express";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import User from "../models/User";
import dbConnect from "../lib/mongoose";

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

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};