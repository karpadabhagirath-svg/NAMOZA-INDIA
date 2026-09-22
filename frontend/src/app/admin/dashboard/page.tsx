"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminOrdersTable from "@/components/AdminOrdersTable";
import { fetchAdminOrders } from "@/lib/api";
import { clearAdminSession, getAdminProfile, getAdminToken } from "@/lib/auth";
import { Order, OrderStatus, STATUS_LABELS } from "@/lib/types";
import clsx from "clsx";

const FILTERS: Array<"ALL" | OrderStatus> = [
  "ALL",
  "RECEIVED",
  "CONFIRMED",
  "IN_PRODUCTION",
  "QUALITY_CHECK",
  "SHIPPED",
  "DELIVERED",
  "ON_HOLD",
  "CANCELLED",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const adminName = getAdminProfile()?.name;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetchAdminOrders(token)
      .then(({ orders: fetched }) => setOrders(fetched))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen px-6 pb-24 pt-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Admin</p>
            <h1 className="mt-2 font-display text-3xl text-mist-100">
              {adminName ? `Welcome back, ${adminName}` : "Orders"}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-silver-300/70 hover:border-gold-400/40 hover:text-gold-300"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full border px-4 py-1.5 text-xs transition-colors",
                filter === f
                  ? "border-gold-400 bg-gold-500/10 text-gold-300"
                  : "border-white/10 text-silver-300/60 hover:border-gold-400/30"
              )}
            >
              {f === "ALL" ? "All" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading && <p className="text-sm text-silver-300/60">Loading orders…</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && <AdminOrdersTable orders={filtered} />}
        </div>
      </div>
    </div>
  );
}
