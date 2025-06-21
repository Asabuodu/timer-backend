

import express from "express";
import { getUserSchedules, getScheduleById, updateSchedule, deleteSchedule } from "../controller/scheduleController";
import { authenticate } from "../middleware/authMiddleware"; // ✅ this is correct

const router = express.Router();

router.get("/", authenticate, getUserSchedules);
router.get("/:id", authenticate, getScheduleById); // ✅ fix here
router.put("/:id", authenticate, updateSchedule);
router.delete("/:id", authenticate, deleteSchedule);


export default router;
