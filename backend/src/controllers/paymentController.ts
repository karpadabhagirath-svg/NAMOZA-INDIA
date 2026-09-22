import { PaymentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";
import { createRazorpayOrder, isRazorpayConfigured, verifyRazorpaySignature } from "../services/razorpayService";

const createPaymentSchema = z.object({ orderId: z.string().min(1) });

/** POST /api/payments/create — public. Creates a Razorpay order for an existing Namoza order. */
export async function createPayment(req: Request, res: Response) {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({ error: "Online payments are not set up yet. Please contact us to arrange payment." });
  }

  const parsed = createPaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "orderId is required" });

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.paymentStatus === PaymentStatus.PAID) {
    return res.status(400).json({ error: "This order has already been paid" });
  }

  const rzpOrder = await createRazorpayOrder(order.quotedPriceInr, order.orderNumber);

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: rzpOrder.id },
  });

  res.json({
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
  });
}

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/** POST /api/payments/verify — public. Verifies the signature returned by Razorpay Checkout. */
export async function verifyPayment(req: Request, res: Response) {
  const parsed = verifyPaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Missing payment verification fields" });

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const valid = verifyRazorpaySignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (!valid) {
    return res.status(400).json({ error: "Payment verification failed. Please contact support." });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: PaymentStatus.PAID,
      razorpayPaymentId: razorpay_payment_id,
    },
  });

  res.json({ order });
}
