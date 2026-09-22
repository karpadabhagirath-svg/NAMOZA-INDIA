"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PaymentButton from "../PaymentButton";
import MagneticButton from "../MagneticButton";
import { Order } from "@/lib/types";

export default function Confirmation({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-lg text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/40 bg-gold-500/10 text-gold-300"
      >
        <CheckCircle2 size={32} />
      </motion.div>

      <h2 className="font-display text-3xl text-mist-100">Order received</h2>
      <p className="mt-3 text-sm text-silver-300/70">
        Your order number is <span className="font-medium text-gold-300">{order.orderNumber}</span>. We&apos;ve
        emailed a confirmation to {order.customerEmail}. Our studio will review your photos and confirm within
        24–48 hours.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4">
        <PaymentButton order={order} />
        <div className="flex gap-4 text-sm">
          <Link href={`/track`} className="text-silver-300/70 hover:text-gold-300">
            Track this order
          </Link>
          <MagneticButton href="/" variant="outline">
            Back to Home
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}
