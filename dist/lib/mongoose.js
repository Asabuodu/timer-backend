"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // 👈 MUST come before using process.env
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in .env");
}
const dbConnect = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    return mongoose_1.default.connect(MONGODB_URI);
};
exports.default = dbConnect;
