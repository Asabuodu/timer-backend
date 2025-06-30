"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TimeSchema = new mongoose_1.default.Schema({
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true },
});
// const CategorySchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   duration: { type: TimeSchema, required: true },
// });
const CategorySchema = new mongoose_1.default.Schema({
    id: { type: String, required: true }, // ✅ was Number, must be String
    name: { type: String, required: true },
    duration: { type: TimeSchema, required: true },
});
const ScheduleSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    categories: [CategorySchema],
    duration: { type: TimeSchema, required: true },
}, { timestamps: true });
// const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
const ScheduleModel = mongoose_1.default.models.Schedule || mongoose_1.default.model("Schedule", ScheduleSchema);
exports.default = ScheduleModel;
