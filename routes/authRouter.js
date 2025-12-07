import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  resendVerificationEmail,
  verifyEmail
} from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema, verifyEmailSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrentUser);
router.patch("/subscription", authMiddleware, updateSubscription);
router.patch("/avatars", authMiddleware, uploadMiddleware.single("avatar"), updateAvatar); 
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", validateBody(verifyEmailSchema), resendVerificationEmail);

export default router;
