"use client";

import { OrderFormState } from "./types";

interface Props {
  form: OrderFormState;
  update: (patch: Partial<OrderFormState>) => void;
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-300/50";

export default function StepDetails({ form, update }: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl text-mist-100">Your details</h2>
      <p className="mt-2 text-sm text-silver-300/70">We&apos;ll use these to confirm your order and arrange delivery.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            required
            value={form.customerName}
            onChange={(e) => update({ customerName: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone number</label>
          <input
            required
            type="tel"
            value={form.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Email</label>
          <input
            required
            type="email"
            value={form.customerEmail}
            onChange={(e) => update({ customerEmail: e.target.value })}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Shipping address</label>
          <textarea
            required
            rows={3}
            value={form.shippingAddress}
            onChange={(e) => update({ shippingAddress: e.target.value })}
            placeholder="House / street, city, state, PIN code"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Anything else we should know? (optional)</label>
          <textarea
            rows={3}
            value={form.referenceNotes}
            onChange={(e) => update({ referenceNotes: e.target.value })}
            placeholder="Additional context about your reference photos or the tribute"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
