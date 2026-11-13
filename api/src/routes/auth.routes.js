import { Router } from "express";
import wrap from "../middleware/asyncHandler.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import * as auth from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 100,
  limit: 20,
  message: { error: "Too many attempts, try again later" },
});

router.post("/register", validate(registerSchema), wrap(auth.register));
router.post("/login", validate(loginSchema), wrap(auth.login));
router.get("/me", authenticate, wrap(auth.me));

export default router;
