import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Dekorációs elem a háttérben */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

      <div className="max-w-md w-full text-center space-y-8">
        <header className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            VALKYRIE
          </h1>
          <p className="text-emerald-500 font-mono text-sm tracking-widest uppercase">
            Master Control Interface v1.0
          </p>
        </header>

        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
          <p className="text-slate-400 mb-8 text-sm">
            Üdvözöljük a rendszerben. A folytatáshoz azonosítás vagy új profil létrehozása szükséges.
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 transition-all duration-200 border-b-4 border-emerald-800 active:border-b-0">
                BEJELENTKEZÉS
              </Button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-mono">VAGY</span>
              </div>
            </div>

            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 py-6 font-semibold">
                REGISZTRÁCIÓ
              </Button>
            </Link>
          </div>
        </div>

        <footer className="pt-8 flex justify-center gap-6 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            SYSTEM_ONLINE
          </div>
          <div>ENCRYPTED_SESSION</div>
        </footer>
      </div>
    </main>
  );
}