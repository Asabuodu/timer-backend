
import express from "express";
import { createSchedule, getUserSchedules, deleteSchedule, updateSchedule  } from "../controller/scheduleController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ GET: Get schedules for logged-in user
router.get("/", authenticate, getUserSchedules);

// ✅ POST: Create schedule for logged-in user
router.post("/", authenticate, createSchedule);


router.delete("/:id", authenticate, deleteSchedule);
router.put("/:id", authenticate, updateSchedule); 

export default router;
