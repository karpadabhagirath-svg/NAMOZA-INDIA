import ContactCTA from "@/components/ContactCTA";
import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ImageToStatue from "@/components/ImageToStatue";
import MaterialsPricing from "@/components/MaterialsPricing";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImageToStatue />
      <HowItWorks />
      <Gallery />
      <MaterialsPricing />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </>
  );
}
