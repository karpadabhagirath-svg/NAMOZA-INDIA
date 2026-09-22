"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import { API_BASE_URL, fetchAdminOrder, updateAdminOrderStatus, updateAdminPaymentStatus } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import {
  MATERIAL_LABELS,
  Order,
  OrderStatus,
  PaymentStatus,
  SIZE_LABELS,
  STATUS_LABELS,
} from "@/lib/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "IN_PRODUCTION",
  "QUALITY_CHECK",
  "SHIPPED",
  "DELIVERED",
  "ON_HOLD",
  "CANCELLED",
];

const PAYMENT_OPTIONS: PaymentStatus[] = ["PENDING", "PAID", "PARTIALLY_PAID", "REFUNDED", "FAILED"];

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    try {
      const { order: fetched } = await fetchAdminOrder(token, params.id);
      setOrder(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleStatusChange = async (status: OrderStatus) => {
    const token = getAdminToken();
    if (!token || !order) return;
    setSaving(true);
    try {
      const { order: updated } = await updateAdminOrderStatus(token, order.id, status, note || undefined);
      setOrder(updated);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentChange = async (paymentStatus: PaymentStatus) => {
    const token = getAdminToken();
    if (!token || !order) return;
    setSaving(true);
    try {
      const { order: updated } = await updateAdminPaymentStatus(token, order.id, paymentStatus);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="px-6 pt-32 text-center text-sm text-silver-300/60">Loading order…</div>;
  }

  if (error || !order) {
    return <div className="px-6 pt-32 text-center text-sm text-red-400">{error || "Order not found"}</div>;
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-28 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-silver-300/70 hover:text-gold-300">
          <ArrowLeft size={15} /> Back to orders
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl text-mist-100">{order.orderNumber}</h1>
            <span className="rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-sm text-gold-300">
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Customer</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-silver-300/60">Name</dt><dd className="text-mist-100">{order.customerName}</dd></div>
                <div className="flex justify-between"><dt className="text-silver-300/60">Email</dt><dd className="text-mist-100">{order.customerEmail}</dd></div>
                <div className="flex justify-between"><dt className="text-silver-300/60">Phone</dt><dd className="text-mist-100">{order.customerPhone}</dd></div>
                <div className="pt-2"><dt className="mb-1 text-silver-300/60">Shipping address</dt><dd className="text-mist-100">{order.shippingAddress}</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Order details</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-silver-300/60">Size</dt><dd className="text-mist-100">{SIZE_LABELS[order.size]}</dd></div>
                <div className="flex justify-between"><dt className="text-silver-300/60">Finish</dt><dd className="text-mist-100">{MATERIAL_LABELS[order.material]}</dd></div>
                <div className="flex justify-between"><dt className="text-silver-300/60">Price</dt><dd className="text-mist-100">₹{order.quotedPriceInr.toLocaleString("en-IN")}</dd></div>
                {order.baseEngraving && (
                  <div className="flex justify-between"><dt className="text-silver-300/60">Engraving</dt><dd className="text-mist-100">{order.baseEngraving}</dd></div>
                )}
                {order.poseNotes && (
                  <div className="pt-2"><dt className="mb-1 text-silver-300/60">Pose notes</dt><dd className="text-mist-100">{order.poseNotes}</dd></div>
                )}
                {order.referenceNotes && (
                  <div className="pt-2"><dt className="mb-1 text-silver-300/60">Other notes</dt><dd className="text-mist-100">{order.referenceNotes}</dd></div>
                )}
              </dl>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">
              Reference photos ({order.photos.length})
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {order.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={absoluteUrl(photo.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-square overflow-hidden rounded-lg border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={absoluteUrl(photo.url)} alt={photo.filename} className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Update status</h2>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    disabled={saving}
                    onClick={() => handleStatusChange(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                      order.status === s
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-white/10 text-silver-300/60 hover:border-gold-400/30"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Optional note to include in the customer's update email"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="mt-4 w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Payment status</h2>
              <p className="mb-4 text-sm text-silver-300/70">Currently: <span className="text-mist-100">{order.paymentStatus}</span></p>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_OPTIONS.map((p) => (
                  <button
                    key={p}
                    disabled={saving}
                    onClick={() => handlePaymentChange(p)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                      order.paymentStatus === p
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-white/10 text-silver-300/60 hover:border-gold-400/30"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-silver-300/40">
                Use this to record offline/UPI payments manually. Online payments via Razorpay update automatically.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <MagneticButton href="/admin/dashboard" variant="outline">
              Done
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
