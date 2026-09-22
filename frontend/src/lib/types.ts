export type StatueMaterial = "RESIN_PAINTED" | "MARBLE_FINISH" | "BRONZE_FINISH" | "WOOD_FINISH";
export type StatueSize = "SMALL_6IN" | "MEDIUM_12IN" | "LARGE_18IN" | "CUSTOM";
export type OrderStatus =
  | "RECEIVED"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "QUALITY_CHECK"
  | "SHIPPED"
  | "DELIVERED"
  | "ON_HOLD"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "REFUNDED" | "FAILED";

export interface OrderPhoto {
  id: string;
  url: string;
  filename: string;
}

export interface StatusEvent {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  material: StatueMaterial;
  size: StatueSize;
  customSizeNotes?: string | null;
  baseEngraving?: string | null;
  poseNotes?: string | null;
  referenceNotes?: string | null;
  quotedPriceInr: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  photos: OrderPhoto[];
  statusEvents?: StatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export const MATERIAL_LABELS: Record<StatueMaterial, string> = {
  RESIN_PAINTED: "Hand-painted Resin",
  MARBLE_FINISH: "Marble Finish",
  BRONZE_FINISH: "Bronze Finish",
  WOOD_FINISH: "Wood Finish",
};

export const SIZE_LABELS: Record<StatueSize, string> = {
  SMALL_6IN: "Small — 6 inch",
  MEDIUM_12IN: "Medium — 12 inch",
  LARGE_18IN: "Large — 18 inch",
  CUSTOM: "Custom size",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Order Received",
  CONFIRMED: "Confirmed",
  IN_PRODUCTION: "In Production",
  QUALITY_CHECK: "Quality Check",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export const STATUS_ORDER: OrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "IN_PRODUCTION",
  "QUALITY_CHECK",
  "SHIPPED",
  "DELIVERED",
];
