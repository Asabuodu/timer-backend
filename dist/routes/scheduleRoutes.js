"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("../controller/scheduleController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // ✅ this is correct
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticate, scheduleController_1.getUserSchedules);
router.get("/:id", authMiddleware_1.authenticate, scheduleController_1.getScheduleById); // ✅ fix here
router.put("/:id", authMiddleware_1.authenticate, scheduleController_1.updateSchedule);
router.delete("/:id", authMiddleware_1.authenticate, scheduleController_1.deleteSchedule);
exports.default = router;
