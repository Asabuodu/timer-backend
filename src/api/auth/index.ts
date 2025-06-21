import express from "express";
import { signup, login, forgotPassword } from "../../controller/authController";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);


export default router;
