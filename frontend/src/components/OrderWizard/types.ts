import { StatueMaterial, StatueSize } from "@/lib/types";

export interface OrderFormState {
  photos: File[];
  material: StatueMaterial;
  size: StatueSize;
  customSizeNotes: string;
  baseEngraving: string;
  poseNotes: string;
  referenceNotes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export const INITIAL_ORDER_FORM: OrderFormState = {
  photos: [],
  material: "RESIN_PAINTED",
  size: "MEDIUM_12IN",
  customSizeNotes: "",
  baseEngraving: "",
  poseNotes: "",
  referenceNotes: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
};
