"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../api/auth")); // adjust path if needed
const router = express_1.default.Router();
router.use("/api/auth", auth_1.default);
exports.default = router;
