"use client";

import { Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-10 border-t border-white/5 bg-graphite-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl text-mist-100">
              NAMOZA <span className="gold-text">INDIA</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-300/70">
              Handcrafted 3D statues made from your most cherished photographs — a lasting,
              personal tribute to the people you love.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="mailto:hello@namozaindia.com"
                className="flex items-center gap-2 text-sm text-silver-200/80 hover:text-gold-300"
              >
                <Mail size={16} /> hello@namozaindia.com
              </a>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <a href="tel:+910000000000" className="flex items-center gap-2 text-sm text-silver-200/80 hover:text-gold-300">
                <Phone size={16} /> +91 00000 00000
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Explore</p>
            <ul className="space-y-3 text-sm text-silver-200/80">
              <li><Link href="/#how-it-works" className="hover:text-gold-300">How It Works</Link></li>
              <li><Link href="/#gallery" className="hover:text-gold-300">Gallery</Link></li>
              <li><Link href="/#pricing" className="hover:text-gold-300">Pricing</Link></li>
              <li><Link href="/customize" className="hover:text-gold-300">Customize a Statue</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-silver-300/50">Support</p>
            <ul className="space-y-3 text-sm text-silver-200/80">
              <li><Link href="/track" className="hover:text-gold-300">Track Your Order</Link></li>
              <li><Link href="/#faq" className="hover:text-gold-300">FAQs</Link></li>
              <li>
                <a href="https://instagram.com/namozaindia" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold-300">
                  <Instagram size={15} /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="royal-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-silver-300/50 md:flex-row">
          <p>© {new Date().getFullYear()} Namoza India. All rights reserved.</p>
          <p>namozaindia.com</p>
        </div>
      </div>
    </footer>
  );
}
