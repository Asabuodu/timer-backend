"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./api/auth"));
const schedules_1 = __importDefault(require("./api/schedules"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "https://timer-frontend-iota.vercel.app",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/schedules", schedules_1.default);
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => console.error("Mongo error:", err));
