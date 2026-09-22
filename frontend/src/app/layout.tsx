import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namozaindia.com"),
  title: {
    default: "Namoza India — Custom 3D Memorial Statues of Your Loved Ones",
    template: "%s · Namoza India",
  },
  description:
    "Namoza India turns a cherished photograph into a handcrafted, custom 3D statue — a lasting tribute to the people you love. Design yours online in minutes.",
  keywords: [
    "custom 3D statue India",
    "photo to statue",
    "memorial statue",
    "personalized statue",
    "Namoza India",
  ],
  openGraph: {
    title: "Namoza India — Custom 3D Memorial Statues",
    description: "Turn a cherished photograph into a handcrafted, custom 3D statue.",
    url: "https://namozaindia.com",
    siteName: "Namoza India",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden bg-graphite-950">
        <div className="pointer-events-none fixed inset-0 bg-royal-radial" aria-hidden />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
