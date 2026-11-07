import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "../lib/prisma.js";
import path from "path";
import { fileURLToPath } from "url";
import wrap from "./middleware/asyncHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

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

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(require("./middleware/errorHandler.js"));

export default app;
