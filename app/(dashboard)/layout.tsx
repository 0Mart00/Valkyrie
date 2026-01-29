// app/(dashboard)/layout.tsx
import React from "react";
export const runtime = "nodejs";

import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Kanban, 
  Share2, 
  Database, 
  Hash 
} from 'lucide-react';
import { getDb } from '@/lib/db';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const db = getDb();
  
  // Csatornák lekérése az adatbázisból a menühöz
  const channels = await db.channel.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  const navItems = [
    { name: 'Workspace', href: '/', icon: LayoutDashboard },
    { name: 'Kanban Flow', href: '/kanban', icon: Kanban },
    { name: 'Neural Chat', href: '/chat', icon: MessageSquare },
    { name: 'Social Feed', href: '/feed', icon: Share2 },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tighter italic text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            MASTER_WS
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <div className="text-[10px] font-mono text-slate-500 px-3 mb-2 uppercase tracking-widest">Navigation</div>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-all group"
            >
              <item.icon size={18} className="text-slate-500 group-hover:text-emerald-400" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}

          {/* DINAMIKUS CSATORNÁK SZAKASZ */}
          <div className="mt-8">
            <div className="text-[10px] font-mono text-slate-500 px-3 mb-2 uppercase tracking-widest">Channels</div>
            <div className="space-y-1">
              {channels.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-600 italic">No channels active</div>
              ) : (
                channels.map((channel) => (
                  <Link 
                    key={channel.id} 
                    href={`/chat?id=${channel.id}`}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-900/50 hover:text-emerald-400 transition-all group"
                  >
                    <Hash size={14} className="text-slate-600 group-hover:text-emerald-500" />
                    <span className="text-sm font-mono truncate">{channel.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-950">
          <div className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-slate-500">
            <Database size={14} className="text-emerald-500" />
            <div className="flex flex-col">
              <span>DB_LOCAL: ACTIVE</span>
              <span className="text-[10px] opacity-50">{channels.length} NODES_FOUND</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}