// app/(dashboard)/layout.tsx
import React from "react";
export const runtime = "nodejs";


import Link from 'next/link';
// Itt javítva: Kanba -> Kanban
import { LayoutDashboard, MessageSquare, Kanban, Share2, Settings, Database } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Workspace', href: '/', icon: LayoutDashboard },
    { name: 'Kanban Flow', href: '/kanban', icon: Kanban }, // Itt is javítva
    { name: 'Neural Chat', href: '/chat', icon: MessageSquare },
    { name: 'Social Feed', href: '/feed', icon: Share2 },
  ];

  // ... a többi kód változatlan

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
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
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
        </nav>

        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-slate-500">
            <Database size={14} />
            <span>DB_LOCAL: ACTIVE</span>
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