import type { Metadata } from "next";
import OrderWizard from "@/components/OrderWizard";

export const metadata: Metadata = {
  title: "Customize Your Statue",
  description: "Upload a photo and customize your own 3D statue with Namoza India.",
};

export default function CustomizePage() {
  return (
    <div className="pt-20">
      <OrderWizard />
    </div>
  );
}
