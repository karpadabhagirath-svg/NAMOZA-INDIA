import crypto from "crypto";
import Razorpay from "razorpay";

let client: Razorpay | null = null;

function getClient(): Razorpay | null {
  if (client) return client;
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.warn("[razorpay] Keys not configured — payment endpoints will return an error.");
    return null;
  }
  client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  return client;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Creates a Razorpay order for the given amount (INR, in rupees). */
export async function createRazorpayOrder(amountInr: number, receipt: string) {
  const rzp = getClient();
  if (!rzp) throw new Error("Payments are not configured on the server yet");

  const order = await rzp.orders.create({
    amount: Math.round(amountInr * 100), // paise
    currency: "INR",
    receipt,
    payment_capture: true,
  });
  return order;
}

/** Verifies the signature Razorpay sends back after checkout completes. */
export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  return expected === params.razorpaySignature;
}
