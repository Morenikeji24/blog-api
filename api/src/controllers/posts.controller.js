import { prisma } from "../../lib/prisma.js";

const listInclude = {
  author: { select: { id: true, username: true } },
  _count: { select: { comments: true } },
};

const isOwner = (user, post) =>
  user?.role === "AUTHOR" && user.id === post.authorId;

async function findOwned(req, res) {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return null;
  }
  if (!isOwner(req.user, post)) {
    res.status(403).json({ error: "You can only modify your own posts" });
    return null;
  }
  return post;
}

export const listPublished = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    include: listInclude,
  });
  res.json({ posts });
};

export const listMine = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { id: req.user.id } },
    orderBy: { updatedAt: "desc" },
    include: listInclude,
  });
  res.json({ posts });
};

export const getOne = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    include: { author: { select: { id: true, username: true } } },
  });

  if (!post || (!post.published && !isOwner(req.user, post))) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json({ post });
};

export const create = async (req, res) => {
  const { title, content, published = false } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      publishedAt: published ? new Date() : null,
      authorId: req.user.id,
    },
  });
  res.status(201).json({ post });
};

export const update = async (req, res) => {
  if (!(await findOwned(req, res))) return;
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ post });
};

export const setPublished = async (req, res) => {
  const existing = await findOwned(req, res);
  if (!existing) return;
  const { published } = req.body;
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      published,
      publishedAt: published
        ? (existing.publishedAt ?? new Date())
        : existing.publishedAt,
    },
  });
  res.json({ post });
};

export const remove = async (req, res) => {
  if (!(await findOwned(req, res))) return;
  await prisma.post.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
