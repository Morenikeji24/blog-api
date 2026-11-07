import { Router } from "express";
import wrap from "../middleware/asyncHandler.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), wrap(auth.register));
router.post("/login", validate(loginSchema), wrap(auth.login));
router.get("/me", authenticate, wrap(auth.me));

export default router;
