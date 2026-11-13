import { prisma } from "../../lib/prisma.js";

const isPostAuthor = (user, post) =>
  user?.role === "AUTHOR" && user.id === post.authorId;

export const listForPost = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.postId },
  });
  if (!post || (!post.published && !isPostAuthor(req.user, post))) {
    return res.status(404).json({ error: "Post not found" });
  }
  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ comments });
};

export const create = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.postId },
  });

  if (!post || !post.published) {
    return res.status(404).json({ error: "Post not found" });
  }

  const username = req.user?.username || req.body.username;
  if (!username) {
    return res.status(400).json({
      error: "Validation failed",
      details: { username: ["Username is required"] },
    });
  }

  const comment = await prisma.comment.create({
    data: {
      content: req.body.content,
      username,
      postId: post.id,
      authorId: req.user?.id ?? null,
    },
  });
  res.status(201).json({ comment });
};

async function findAllowed(req, res) {
  const comment = await prisma.comment.findUnique({
    where: { id: req.params.id },
    include: { post: true },
  });
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return null;
  }
  const allowed =
    isPostAuthor(req.user, comment.post) ||
    (comment.authorId !== null && comment.authorId === req.user.id);
  if (!allowed) {
    res.status(403).json({ error: "Not allowed to modify this comment" });
    return null;
  }
  return comment;
}

export const update = async (req, res) => {
  if (!(await findAllowed(req, res))) return;
  const comment = await prisma.comment.update({
    where: { id: req.params.id },
    data: { content: req.body.content },
  });
  res.json({ comment });
};

export const remove = async (req, res) => {
  if (!(await findAllowed(req, res))) return;
  await prisma.comment.delete({
    where: { id: req.params.id },
  });
  res.status(204).end();
};
