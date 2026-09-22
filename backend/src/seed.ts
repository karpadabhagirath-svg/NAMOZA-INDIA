import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./prismaClient";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "owner@namozaindia.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const name = process.env.ADMIN_NAME || "Namoza India Admin";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists for ${email} — skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { email, name, passwordHash } });
  console.log(`Created admin user: ${email}`);
  console.log(`Log in at /admin/login with this email and the ADMIN_PASSWORD from your .env`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
