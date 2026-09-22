import { Order, StatueMaterial, StatueSize } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function parseJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
  return data;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  material: StatueMaterial;
  size: StatueSize;
  customSizeNotes?: string;
  baseEngraving?: string;
  poseNotes?: string;
  referenceNotes?: string;
  photos: File[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ order: Order }> {
  const form = new FormData();
  form.append("customerName", payload.customerName);
  form.append("customerEmail", payload.customerEmail);
  form.append("customerPhone", payload.customerPhone);
  form.append("shippingAddress", payload.shippingAddress);
  form.append("material", payload.material);
  form.append("size", payload.size);
  if (payload.customSizeNotes) form.append("customSizeNotes", payload.customSizeNotes);
  if (payload.baseEngraving) form.append("baseEngraving", payload.baseEngraving);
  if (payload.poseNotes) form.append("poseNotes", payload.poseNotes);
  if (payload.referenceNotes) form.append("referenceNotes", payload.referenceNotes);
  payload.photos.forEach((file) => form.append("photos", file));

  const res = await fetch(`${API_BASE_URL}/api/orders`, { method: "POST", body: form });
  return parseJsonOrThrow(res);
}

export async function trackOrder(orderNumber: string, email: string): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE_URL}/api/orders/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderNumber, email }),
  });
  return parseJsonOrThrow(res);
}

export async function submitContact(payload: { name: string; email: string; message: string }) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(res);
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: { id: string; name: string; email: string } }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchAdminOrders(token: string): Promise<{ orders: Order[] }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders`, { headers: authHeaders(token) });
  return parseJsonOrThrow(res);
}

export async function fetchAdminOrder(token: string, id: string): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, { headers: authHeaders(token) });
  return parseJsonOrThrow(res);
}

export async function updateAdminOrderStatus(
  token: string,
  id: string,
  status: string,
  note?: string
): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status, note }),
  });
  return parseJsonOrThrow(res);
}

export async function updateAdminPaymentStatus(
  token: string,
  id: string,
  paymentStatus: string
): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ paymentStatus }),
  });
  return parseJsonOrThrow(res);
}
