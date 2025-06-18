// import express from "express";
// import { getUserSchedules, getScheduleById } from "../controller/scheduleController";
// import { authenticate} from "../middleware/authMiddleware"; // Assuming you already have this

// const router = express.Router();

// router.get("/", authenticate, getUserSchedules);
// router.get("/:id", authenticateToken, getScheduleById);


// export default router;


import express from "express";
import { getUserSchedules, getScheduleById } from "../controller/scheduleController";
import { authenticate } from "../middleware/authMiddleware"; // ✅ this is correct

const router = express.Router();

router.get("/", authenticate, getUserSchedules);
router.get("/:id", authenticate, getScheduleById); // ✅ fix here

export default router;
