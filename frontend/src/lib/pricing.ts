import { StatueMaterial, StatueSize } from "./types";

// Mirrors backend/src/utils/pricing.ts — keep both in sync if you change prices.
// This copy only drives the live estimate shown while customizing; the
// authoritative price is always calculated server-side when the order is created.
const SIZE_BASE_PRICE: Record<StatueSize, number> = {
  SMALL_6IN: 899,
  MEDIUM_12IN: 1799,
  LARGE_18IN: 2999,
  CUSTOM: 3499,
};

const MATERIAL_ADDON: Record<StatueMaterial, number> = {
  RESIN_PAINTED: 0,
  MARBLE_FINISH: 399,
  BRONZE_FINISH: 799,
  WOOD_FINISH: 499,
};

export function estimateQuote(material: StatueMaterial, size: StatueSize): number {
  return SIZE_BASE_PRICE[size] + MATERIAL_ADDON[material];
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
