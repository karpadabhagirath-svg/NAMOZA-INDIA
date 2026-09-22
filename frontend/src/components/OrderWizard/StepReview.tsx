"use client";

import { estimateQuote, formatInr } from "@/lib/pricing";
import { MATERIAL_LABELS, SIZE_LABELS } from "@/lib/types";
import { OrderFormState } from "./types";

interface Props {
  form: OrderFormState;
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-3 text-sm last:border-0">
      <span className="text-silver-300/60">{label}</span>
      <span className="text-right text-mist-100">{value}</span>
    </div>
  );
}

export default function StepReview({ form }: Props) {
  const estimate = estimateQuote(form.material, form.size);

  return (
    <div>
      <h2 className="font-display text-2xl text-mist-100">Review your order</h2>
      <p className="mt-2 text-sm text-silver-300/70">
        Double-check everything below — you&apos;ll receive a confirmation email once it&apos;s submitted.
      </p>

      <div className="mt-8 rounded-2xl border border-white/5 bg-graphite-900/60 p-6">
        <Row label="Photos uploaded" value={`${form.photos.length} photo${form.photos.length === 1 ? "" : "s"}`} />
        <Row label="Size" value={SIZE_LABELS[form.size]} />
        <Row label="Finish" value={MATERIAL_LABELS[form.material]} />
        {form.customSizeNotes && <Row label="Custom size notes" value={form.customSizeNotes} />}
        {form.baseEngraving && <Row label="Base engraving" value={form.baseEngraving} />}
        {form.poseNotes && <Row label="Pose / styling notes" value={form.poseNotes} />}
        <Row label="Name" value={form.customerName} />
        <Row label="Email" value={form.customerEmail} />
        <Row label="Phone" value={form.customerPhone} />
        <Row label="Shipping address" value={form.shippingAddress} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gold-400/20 bg-gold-500/5 px-6 py-5">
        <span className="text-sm text-silver-200/80">Total estimated price</span>
        <span className="font-display text-2xl text-gold-300">{formatInr(estimate)}</span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-silver-300/50">
        By submitting, you agree that our studio may contact you to confirm details before
        production begins. Payment is collected after your photos are reviewed and the order is
        confirmed.
      </p>
    </div>
  );
}
