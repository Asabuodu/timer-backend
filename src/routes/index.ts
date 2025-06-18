import express from "express";
import authRoutes from "../api/auth"; // adjust path if needed

const router = express.Router();

router.use("/api/auth", authRoutes);

export default router;
