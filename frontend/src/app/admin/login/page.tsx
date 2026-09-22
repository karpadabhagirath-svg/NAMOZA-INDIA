"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import { adminLogin } from "@/lib/api";
import { saveAdminSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const { token, admin } = await adminLogin(email, password);
      saveAdminSession(token, admin);
      router.push("/admin/dashboard");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-white/5 bg-graphite-900/70 p-8"
      >
        <p className="text-center font-display text-xl text-mist-100">
          Namoza <span className="gold-text">India</span> Admin
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            required
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-graphite-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-silver-300/40 focus:border-gold-400/60 focus:outline-none"
          />
          <MagneticButton type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Signing in…" : "Sign In"}
          </MagneticButton>
          {status === "error" && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}
