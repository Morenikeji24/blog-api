import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "../lib/prisma.js";
import wrap from "./middleware/asyncHandler.js";
import postRoutes from "./routes/posts.routes.js";
import authRoutes from "./routes/auth.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { boolean } from "zod";

if (!process.env.JWT_SECRET) throw new Error("JWT secret is not set");

const app = express();
app.set("set proxy", 1);

const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.get(
  "/",
  wrap(async (req, res) => {
    const users = await prisma.user.count();
    res.json({ status: "Ok", users });
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

export default app;
