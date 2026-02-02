"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (res.ok) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 italic tracking-tighter text-emerald-500">ÚJ_HOZZÁFÉRÉS_LÉTREHOZÁSA</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">IDENTITÁS_NEVE</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 focus:border-emerald-500 outline-none transition-all"
              placeholder="Pl: Admin_01"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">EMAIL_KAPCSOLAT</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 focus:border-emerald-500 outline-none transition-all"
              placeholder="user@valkyrie.sys"
              required
            />
          </div>
          <Button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 mt-4">
            {loading ? "FOLYAMATBAN..." : "REGISZTRÁCIÓ"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 font-mono">
          MÁR VAN HOZZÁFÉRÉSED? <Link href="/auth/login" className="text-emerald-500 hover:underline">BELÉPÉS</Link>
        </p>
      </div>
    </main>
  );
}