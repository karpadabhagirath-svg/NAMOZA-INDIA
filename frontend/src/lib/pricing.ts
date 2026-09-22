import { StatueMaterial, StatueSize } from "./types";

// Mirrors backend/src/utils/pricing.ts — keep both in sync if you change prices.
// This copy only drives the live estimate shown while customizing; the
// authoritative price is always calculated server-side when the order is created.
const SIZE_BASE_PRICE: Record<StatueSize, number> = {
  SMALL_6IN: 3499,
  MEDIUM_12IN: 6999,
  LARGE_18IN: 12999,
  CUSTOM: 14999,
};

const MATERIAL_ADDON: Record<StatueMaterial, number> = {
  RESIN_PAINTED: 0,
  MARBLE_FINISH: 1500,
  BRONZE_FINISH: 3000,
  WOOD_FINISH: 2000,
};

export function estimateQuote(material: StatueMaterial, size: StatueSize): number {
  return SIZE_BASE_PRICE[size] + MATERIAL_ADDON[material];
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
