"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import PaymentButton from "@/components/PaymentButton";
import Reveal from "@/components/Reveal";
import TrackingTimeline from "@/components/TrackingTimeline";
import { trackOrder } from "@/lib/api";
import { formatInr } from "@/lib/pricing";
import { MATERIAL_LABELS, Order, SIZE_LABELS } from "@/lib/types";

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setOrder(null);
    try {
      const { order: found } = await trackOrder(orderNumber.trim(), email.trim());
      setOrder(found);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Order not found");
    }
  };

  return (
    <div className="px-6 pb-32 pt-40">
      <div className="mx-auto max-w-xl">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Track Order</p>
          <h1 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">Where&apos;s my statue?</h1>
          <p className="mt-3 text-sm text-silver-300/70">
            Enter your order number and the email you used at checkout.
          </p>
        </Reveal>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <input
            required
            placeholder="Order number, e.g. NMZ-20260922-4821"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email used at checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
          <MagneticButton type="submit" disabled={status === "loading"} className="w-full">
            <Search size={16} /> {status === "loading" ? "Searching…" : "Track Order"}
          </MagneticButton>
          {status === "error" && <p className="text-sm text-red-400">{error}</p>}
        </form>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-2xl border border-white/5 bg-graphite-900/60 p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-silver-300/50">Order</p>
                <p className="font-display text-lg text-mist-100">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-silver-300/50">Estimated total</p>
                <p className="font-display text-lg text-gold-300">{formatInr(order.quotedPriceInr)}</p>
              </div>
            </div>

            <p className="mt-2 text-sm text-silver-300/70">
              {SIZE_LABELS[order.size]} · {MATERIAL_LABELS[order.material]}
            </p>

            <div className="my-6 royal-divider" />

            <TrackingTimeline order={order} />

            {order.paymentStatus !== "PAID" && (
              <div className="mt-8 border-t border-white/5 pt-6">
                <p className="mb-3 text-sm text-silver-300/70">Payment status: {order.paymentStatus}</p>
                <PaymentButton order={order} onPaid={() => setOrder({ ...order, paymentStatus: "PAID" })} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
