"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Order } from "@/lib/types";
import MagneticButton from "./MagneticButton";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  order: Order;
  onPaid?: () => void;
}

/** Opens Razorpay Checkout for a given order, then verifies the payment with the backend. */
export default function PaymentButton({ order, onPaid }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handlePay = async () => {
    setStatus("loading");
    setError("");
    try {
      const createRes = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Could not start payment");

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load the payment gateway. Check your connection and try again.");

      const rzp = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: "Namoza India",
        description: `Order ${order.orderNumber}`,
        order_id: createData.razorpayOrderId,
        prefill: {
          name: createData.customerName,
          email: createData.customerEmail,
          contact: createData.customerPhone,
        },
        theme: { color: "#B08D57" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: order.id, ...response }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            setStatus("idle");
            onPaid?.();
          } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      rzp.open();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not start payment");
    }
  };

  return (
    <div>
      <MagneticButton onClick={handlePay} disabled={status === "loading"}>
        {status === "loading" ? "Preparing payment…" : `Pay ${order.quotedPriceInr.toLocaleString("en-IN")} now`}
      </MagneticButton>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
