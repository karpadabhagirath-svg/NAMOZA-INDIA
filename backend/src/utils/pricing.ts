import { StatueMaterial, StatueSize } from "@prisma/client";

// Base price per size, in INR. Edit these to match your real pricing.
const SIZE_BASE_PRICE: Record<StatueSize, number> = {
  SMALL_6IN: 899,
  MEDIUM_12IN: 1799,
  LARGE_18IN: 2999,
  CUSTOM: 3499, // starting price — final quote confirmed by the studio
};

// Additional cost by material/finish, in INR.
const MATERIAL_ADDON: Record<StatueMaterial, number> = {
  RESIN_PAINTED: 0,
  MARBLE_FINISH: 399,
  BRONZE_FINISH: 799,
  WOOD_FINISH: 499,
};

export function calculateQuote(material: StatueMaterial, size: StatueSize): number {
  return SIZE_BASE_PRICE[size] + MATERIAL_ADDON[material];
}

export const PRICING_TABLE = { SIZE_BASE_PRICE, MATERIAL_ADDON };
