import { KanbanBoard } from "@/components/kanban/Board";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter italic">MASTER_WORKSPACE_v1.0</h1>
          <div className="flex gap-4 text-xs font-mono text-emerald-500">
            <span>DB_STATUS: ONLINE</span>
            <span>AUTH_STATUS: BYPASSED_DEV</span>
          </div>
        </header>
        
        {/* Ide kerül majd a Kanban tábla */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[600px]">
            <h2 className="text-xl font-semibold mb-6">Projekt: Alpha Stratégia</h2>
            <p className="text-slate-400 mb-4 text-sm">Húzd át a kártyákat az oszlopok között a státusz módosításához.</p>
            {/* Itt hívjuk majd be a Board komponenst */}
            <div className="flex gap-4">
               {/* Ideiglenes placeholder oszlopok */}
               <div className="w-80 h-96 bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                  Backlog (Empty)
               </div>
               <div className="w-80 h-96 bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                  In Progress (Empty)
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}