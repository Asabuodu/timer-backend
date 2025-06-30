"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("../controller/scheduleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ✅ GET: Get schedules for logged-in user
router.get("/", authMiddleware_1.authenticate, scheduleController_1.getUserSchedules);
// ✅ POST: Create schedule for logged-in user
router.post("/", authMiddleware_1.authenticate, scheduleController_1.createSchedule);
router.delete("/:id", authMiddleware_1.authenticate, scheduleController_1.deleteSchedule);
router.put("/:id", authMiddleware_1.authenticate, scheduleController_1.updateSchedule);
exports.default = router;
