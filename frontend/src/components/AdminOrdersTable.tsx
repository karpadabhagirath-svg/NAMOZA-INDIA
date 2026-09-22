"use client";

import Link from "next/link";
import { formatInr } from "@/lib/pricing";
import { Order, STATUS_LABELS } from "@/lib/types";
import clsx from "clsx";

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "bg-silver-300/10 text-silver-200",
  CONFIRMED: "bg-blue-400/10 text-blue-300",
  IN_PRODUCTION: "bg-gold-400/10 text-gold-300",
  QUALITY_CHECK: "bg-purple-400/10 text-purple-300",
  SHIPPED: "bg-teal-400/10 text-teal-300",
  DELIVERED: "bg-green-400/10 text-green-300",
  ON_HOLD: "bg-orange-400/10 text-orange-300",
  CANCELLED: "bg-red-400/10 text-red-300",
};

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="py-16 text-center text-sm text-silver-300/60">No orders match this filter yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-graphite-900/80 text-xs uppercase tracking-wider text-silver-300/50">
          <tr>
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Payment</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Placed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-4">
                <Link href={`/admin/orders/${order.id}`} className="font-medium text-gold-300 hover:underline">
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-5 py-4 text-mist-100">{order.customerName}</td>
              <td className="px-5 py-4 text-silver-200/80">{formatInr(order.quotedPriceInr)}</td>
              <td className="px-5 py-4">
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-1 text-xs",
                    order.paymentStatus === "PAID" ? "bg-green-400/10 text-green-300" : "bg-silver-300/10 text-silver-300"
                  )}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={clsx("rounded-full px-2.5 py-1 text-xs", STATUS_COLORS[order.status])}>
                  {STATUS_LABELS[order.status]}
                </span>
              </td>
              <td className="px-5 py-4 text-silver-300/60">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
