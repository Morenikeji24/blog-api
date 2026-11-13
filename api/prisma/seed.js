import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

(async () => {
  const user = await prisma.user.upsert({
    where: { email: process.env.SEED_EMAIL },
    update: {},
    create: {
      email: process.env.SEED_EMAIL,
      username: "author",
      password: await bcrypt.hash(process.env.SEED_PASSWORD, 10),
      role: "AUTHOR",
    },
  });
  console.log("Author ready: ", user.email);
  await prisma.$disconnect();
})();
