import express from "express";
import { signup, 
      login,
     forgotPassword,
     verifyToken,
  resetPassword 
} from "../../controller/authController";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-token", verifyToken);
router.post("/reset-password", resetPassword);


export default router;
