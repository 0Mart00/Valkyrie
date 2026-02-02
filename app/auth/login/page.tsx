"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // SIKERES LOGIN: Átirányítás a dashboard főoldalára (pl. kanban)
        router.push("/kanban"); 
      } else {
        setError(data.error || "Azonosítási hiba történt.");
      }
    } catch (err) {
      setError("Hálózati hiba. Ellenőrizd az adatbázis kapcsolatot!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50 font-mono text-emerald-500">
            {loading ? "..." : "◈"}
          </div>
          <h2 className="text-xl font-bold tracking-widest uppercase italic font-mono">Belépés_Folyamatban</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-widest">Rendszer_ID (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-slate-800 rounded-lg px-4 py-3 mt-1 focus:ring-1 focus:ring-emerald-500 outline-none font-mono text-sm"
              placeholder="user@valkyrie.sys"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded text-red-400 text-xs font-mono">
              HIBA: {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 tracking-[0.2em] transition-all"
          >
            {loading ? "DATA_SYNC..." : "SESSION_START"}
          </Button>
        </form>
      </div>
    </main>
  );
}