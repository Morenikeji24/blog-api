import { Router } from "express";
import wrap from "../middleware/asyncHandler.js";
import validate from "../middleware/validate.js";
import parseId from "../middleware/parseId.js";
import {
  authenticate,
  optionalAuth,
  requireAuthor,
} from "../middleware/auth.js";
import {
  createPostSchema,
  updatePostSchema,
  publishSchema,
} from "../validators/posts.js";
import * as posts from "../controllers/posts.controller.js";
import { createCommentSchema } from "../validators/comments.js";
import * as comments from "../controllers/comments.controller.js";

const router = Router();

router.get("/", wrap(posts.listPublished));
router.get("/mine", authenticate, requireAuthor, wrap(posts.listMine));
router.get("/:id", parseId("id"), optionalAuth, wrap(posts.getOne));

router.post(
  "/",
  authenticate,
  requireAuthor,
  validate(createPostSchema),
  wrap(posts.create),
);
router.put(
  "/:id",
  parseId("id"),
  authenticate,
  requireAuthor,
  validate(updatePostSchema),
  wrap(posts.update),
);
router.patch(
  "/:id/publish",
  parseId("id"),
  authenticate,
  requireAuthor,
  validate(publishSchema),
  wrap(posts.setPublished),
);
router.delete(
  "/:id",
  parseId("id"),
  authenticate,
  requireAuthor,
  wrap(posts.remove),
);

router.get(
  "/:postId/comments",
  parseId("postId"),
  optionalAuth,
  wrap(comments.listForPost),
);
router.post(
  "/:postId/comments",
  parseId("postId"),
  optionalAuth,
  validate(createCommentSchema),
  wrap(comments.create),
);

export default router;
