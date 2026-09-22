import { Request, Response } from "express";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
});

import { sendContactFormAlert } from "../services/emailService";

/** POST /api/contact — public. Simple contact form. */
export async function submitContact(req: Request, res: Response) {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please fill in your name, a valid email, and a message" });
  }

  await sendContactFormAlert(parsed.data).catch(() => {});

  res.json({ ok: true });
}
