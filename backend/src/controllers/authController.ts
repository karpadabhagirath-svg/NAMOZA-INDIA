import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);

  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}
