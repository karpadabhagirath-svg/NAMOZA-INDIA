"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";

export default function ContactCTA() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitContact(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal>
          <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-graphite-900 to-graphite-950 p-8 shadow-soft sm:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Get in Touch</p>
                <h2 className="mt-4 font-display text-3xl text-mist-100">Have a question before you order?</h2>
                <p className="mt-4 text-sm leading-relaxed text-silver-300/70">
                  Tell us about the tribute you have in mind, and our team will get back to you
                  within one business day.
                </p>
                <div className="mt-8">
                  <MagneticButton href="/customize">Start Customizing Instead</MagneticButton>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
                />
                <MagneticButton type="submit" disabled={status === "sending"} className="w-full">
                  {status === "sending" ? "Sending…" : "Send Message"}
                </MagneticButton>
                {status === "sent" && <p className="text-sm text-gold-300">Thanks — we&apos;ll be in touch soon.</p>}
                {status === "error" && <p className="text-sm text-red-400">{error}</p>}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
