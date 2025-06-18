
import express from "express";
import { createSchedule, getUserSchedules } from "../controller/scheduleController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ GET: Get schedules for logged-in user
router.get("/", authenticate, getUserSchedules);

// ✅ POST: Create schedule for logged-in user
router.post("/", authenticate, createSchedule);

export default router;
