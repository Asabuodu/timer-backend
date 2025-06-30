"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateSchedule = exports.getScheduleById = exports.createSchedule = exports.getUserSchedules = void 0;
const Schedule_1 = __importDefault(require("../models/Schedule"));
// ✅ Get all schedules for logged-in user
const getUserSchedules = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedules = await Schedule_1.default.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch schedules", error });
    }
};
exports.getUserSchedules = getUserSchedules;
const createSchedule = async (req, res) => {
    try {
        const userId = req.user?.id; // or `userId` depending on your token payload
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, categories, duration } = req.body;
        if (!title || !categories || !duration) {
            res.status(400).json({ message: "Missing title, categories, or duration" });
            return;
        }
        const schedule = new Schedule_1.default({
            userId,
            title,
            categories,
            duration,
        });
        await schedule.save();
        res.status(201).json(schedule);
    }
    catch (error) {
        console.error("❌ Failed to create schedule:", error);
        res.status(500).json({ message: "Failed to create schedule" });
    }
};
exports.createSchedule = createSchedule;
// ✅ Get a specific schedule by ID (owned by the logged-in user)
const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedule = await Schedule_1.default.findOne({ _id: id, userId });
        if (!schedule) {
            res.status(404).json({ error: "Schedule not found" });
            return;
        }
        res.status(200).json(schedule);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getScheduleById = getScheduleById;
// edit schedule api
const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, duration, categories } = req.body;
        const updated = await Schedule_1.default.findByIdAndUpdate(id, {
            title,
            duration,
            categories,
            updatedAt: new Date(),
        }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json(updated);
        return;
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Failed to update schedule" });
        return;
    }
};
exports.updateSchedule = updateSchedule;
const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Schedule_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json({ message: "Schedule deleted successfully" });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteSchedule = deleteSchedule;
