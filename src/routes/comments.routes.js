import { Router } from "express";
import wrap from "../middleware/asyncHandler.js";
import validate from "../middleware/validate.js";
import parseId from "../middleware/parseId";
import { authenticate } from "../middleware/auth";
import { updateCommentSchema } from "../validators/comments";
import * as comments from "../controllers/comments.controller.js";

const router = Router();

router.put(
  "/:id",
  parseId("id"),
  authenticate,
  validate(updateCommentSchema),
  wrap(comments.update),
);

router.delete("/:id", parseId("id"), authenticate, wrap(comments.remove));

export default router;
