import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "../lib/prisma.js";
import wrap from "./middleware/asyncHandler.js";
import postRoutes from "./routes/posts.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
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

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(require("./middleware/errorHandler.js"));

export default app;
