import { OrderStatus, StatueMaterial, StatueSize } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth";
import { prisma } from "../prismaClient";
import { sendAdminNewOrderAlert, sendOrderConfirmationEmail, sendStatusUpdateEmail } from "../services/emailService";
import { getPhotoUrl, uploadPhotoToS3 } from "../services/s3Service";
import { generateOrderNumber } from "../utils/orderNumber";
import { calculateQuote } from "../utils/pricing";

const createOrderSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6).max(20),
  shippingAddress: z.string().min(10).max(500),
  material: z.nativeEnum(StatueMaterial),
  size: z.nativeEnum(StatueSize),
  customSizeNotes: z.string().max(300).optional(),
  baseEngraving: z.string().max(100).optional(),
  poseNotes: z.string().max(1000).optional(),
  referenceNotes: z.string().max(1000).optional(),
});

/** Replaces each photo's stored S3 key with a time-limited signed URL for the response. */
async function withSignedPhotoUrls<T extends { photos: Array<{ url: string }> }>(order: T): Promise<T> {
  const photos = await Promise.all(
    order.photos.map(async (photo) => ({ ...photo, url: await getPhotoUrl(photo.url) }))
  );
  return { ...order, photos } as T;
}

/** POST /api/orders — public. Accepts multipart/form-data with up to 6 photos + order fields. */
export async function createOrder(req: Request, res: Response) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please check the form for missing or invalid fields", details: parsed.error.flatten() });
  }

  const files = (req.files as Express.Multer.File[] | undefined) || [];
  if (files.length === 0) {
    return res.status(400).json({ error: "Please upload at least one photo of your loved one" });
  }

  const data = parsed.data;
  const quotedPriceInr = calculateQuote(data.material, data.size);
  const orderNumber = generateOrderNumber();

  const uploadedPhotos = await Promise.all(
    files.map(async (f) => ({
      url: await uploadPhotoToS3(f),
      filename: f.originalname,
    }))
  );

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail.toLowerCase().trim(),
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      material: data.material,
      size: data.size,
      customSizeNotes: data.customSizeNotes,
      baseEngraving: data.baseEngraving,
      poseNotes: data.poseNotes,
      referenceNotes: data.referenceNotes,
      quotedPriceInr,
      status: OrderStatus.RECEIVED,
      photos: {
        create: uploadedPhotos,
      },
      statusEvents: {
        create: [{ status: OrderStatus.RECEIVED, note: "Order placed by customer" }],
      },
    },
    include: { photos: true },
  });

  // Best-effort notifications — don't fail the request if email sending has issues.
  sendOrderConfirmationEmail({
    to: order.customerEmail,
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    quotedPriceInr: order.quotedPriceInr,
  }).catch(() => {});
  sendAdminNewOrderAlert({ orderNumber: order.orderNumber, customerName: order.customerName }).catch(() => {});

  res.status(201).json({ order: await withSignedPhotoUrls(order) });
}

const trackSchema = z.object({
  orderNumber: z.string().min(4),
  email: z.string().email(),
});

/** POST /api/orders/track — public. Look up an order by order number + email. */
export async function trackOrder(req: Request, res: Response) {
  const parsed = trackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please provide a valid order number and email" });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: parsed.data.orderNumber.trim(),
      customerEmail: parsed.data.email.toLowerCase().trim(),
    },
    include: {
      photos: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) {
    return res.status(404).json({ error: "No order found with that order number and email" });
  }

  res.json({ order: await withSignedPhotoUrls(order) });
}

/** GET /api/admin/orders — admin only. List all orders, most recent first. */
export async function listOrders(_req: AuthedRequest, res: Response) {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true },
  });
  res.json({ orders });
}

/** GET /api/admin/orders/:id — admin only. Full order detail. */
export async function getOrder(req: AuthedRequest, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { photos: true, statusEvents: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order: await withSignedPhotoUrls(order) });
}

const updateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().max(500).optional(),
  notifyCustomer: z.boolean().optional().default(true),
});

/** PATCH /api/admin/orders/:id/status — admin only. */
export async function updateOrderStatus(req: AuthedRequest, res: Response) {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid status update", details: parsed.error.flatten() });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      statusEvents: { create: { status: parsed.data.status, note: parsed.data.note } },
    },
  });

  if (parsed.data.notifyCustomer) {
    sendStatusUpdateEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status: order.status,
      note: parsed.data.note,
    }).catch(() => {});
  }

  res.json({ order });
}

const updatePaymentSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "PARTIALLY_PAID", "REFUNDED", "FAILED"]),
});

/** PATCH /api/admin/orders/:id/payment — admin only. Manually mark payment status (e.g. offline/UPI payment). */
export async function updatePaymentStatus(req: AuthedRequest, res: Response) {
  const parsed = updatePaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payment status" });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { paymentStatus: parsed.data.paymentStatus },
  });

  res.json({ order });
}
