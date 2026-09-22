"use client";

import clsx from "clsx";
import { estimateQuote, formatInr } from "@/lib/pricing";
import { MATERIAL_LABELS, SIZE_LABELS, StatueMaterial, StatueSize } from "@/lib/types";
import { OrderFormState } from "./types";

const MATERIALS = Object.keys(MATERIAL_LABELS) as StatueMaterial[];
const SIZES = Object.keys(SIZE_LABELS) as StatueSize[];

interface Props {
  form: OrderFormState;
  update: (patch: Partial<OrderFormState>) => void;
}

export default function StepOptions({ form, update }: Props) {
  const estimate = estimateQuote(form.material, form.size);

  return (
    <div>
      <h2 className="font-display text-2xl text-mist-100">Choose your style</h2>
      <p className="mt-2 text-sm text-silver-300/70">Pick a size and finish — you can always add notes for anything specific.</p>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Size</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => update({ size })}
              className={clsx(
                "rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
                form.size === size
                  ? "border-gold-400 bg-gold-500/10 text-mist-100"
                  : "border-white/10 bg-graphite-900/50 text-silver-300/80 hover:border-gold-400/30"
              )}
            >
              {SIZE_LABELS[size]}
            </button>
          ))}
        </div>
        {form.size === "CUSTOM" && (
          <textarea
            placeholder="Describe the size you have in mind…"
            value={form.customSizeNotes}
            onChange={(e) => update({ customSizeNotes: e.target.value })}
            rows={2}
            className="mt-3 w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
        )}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Finish</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MATERIALS.map((material) => (
            <button
              key={material}
              type="button"
              onClick={() => update({ material })}
              className={clsx(
                "rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
                form.material === material
                  ? "border-gold-400 bg-gold-500/10 text-mist-100"
                  : "border-white/10 bg-graphite-900/50 text-silver-300/80 hover:border-gold-400/30"
              )}
            >
              {MATERIAL_LABELS[material]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-300/50">
            Base engraving (optional)
          </label>
          <input
            maxLength={100}
            placeholder="e.g. “Forever in our hearts”"
            value={form.baseEngraving}
            onChange={(e) => update({ baseEngraving: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-300/50">
            Pose / styling notes (optional)
          </label>
          <input
            placeholder="e.g. seated, smiling, in a saree"
            value={form.poseNotes}
            onChange={(e) => update({ poseNotes: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-gold-400/20 bg-gold-500/5 px-6 py-5">
        <span className="text-sm text-silver-200/80">Estimated price</span>
        <span className="font-display text-2xl text-gold-300">{formatInr(estimate)}</span>
      </div>
    </div>
  );
}
