import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );

const publicUser = ({ id, username, email, role }) => ({
  id,
  username,
  email,
  role,
});

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await prisma.user.create({
    data: { username, email, password: await bcrypt.hash(password, 10) },
  });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid)
    return res.status(401).json({ error: "Invalid email or password" });
  res.json({ token: signToken(user), user: publicUser(user) });
};

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(401).json({ error: "User no longer exists" });
  res.json({ user: publicUser(user) });
};
