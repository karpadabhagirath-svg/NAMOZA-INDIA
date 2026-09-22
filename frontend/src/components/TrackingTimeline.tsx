"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Order, STATUS_LABELS, STATUS_ORDER } from "@/lib/types";
import clsx from "clsx";

export default function TrackingTimeline({ order }: { order: Order }) {
  const isTerminalOther = order.status === "CANCELLED" || order.status === "ON_HOLD";
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div>
      {isTerminalOther && (
        <div className="mb-8 rounded-lg border border-gold-400/30 bg-gold-500/5 px-4 py-3 text-sm text-gold-300">
          Current status: {STATUS_LABELS[order.status]}
          {order.statusEvents?.length ? ` — ${order.statusEvents[order.statusEvents.length - 1].note ?? ""}` : ""}
        </div>
      )}

      <div className="relative">
        {STATUS_ORDER.map((status, i) => {
          const done = !isTerminalOther && i <= currentIdx;
          const isCurrent = !isTerminalOther && i === currentIdx;
          return (
            <div key={status} className="relative flex gap-4 pb-8 last:pb-0">
              {i < STATUS_ORDER.length - 1 && (
                <span
                  className={clsx(
                    "absolute left-[15px] top-8 h-full w-px",
                    done ? "bg-gold-400/60" : "bg-white/10"
                  )}
                />
              )}
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: done ? "rgba(176,141,87,0.2)" : "rgba(255,255,255,0.03)",
                  borderColor: done ? "rgba(199,168,118,0.9)" : "rgba(255,255,255,0.15)",
                }}
                className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
              >
                {done ? (
                  <Check size={14} className="text-gold-300" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-silver-300/40" />
                )}
              </motion.div>
              <div className="pt-1">
                <p className={clsx("text-sm font-medium", done ? "text-mist-100" : "text-silver-300/50")}>
                  {STATUS_LABELS[status]}
                  {isCurrent && <span className="ml-2 text-xs text-gold-300">(current)</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
