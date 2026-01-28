// app/(dashboard)/chat/page.tsx
import type { Metadata } from "next";
export const runtime = "nodejs";

export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db'; // 'db' helyett 'getDb' importálása

import React from 'react';
import { Hash } from "lucide-react";
import { ChatInterface } from '@/components/chat/ChatInterface';

export default async function ChatPage() {
  const db = getDb(); // A db példány lekérése a függvényen belül
  
  // A lekérés előtt itt példányosítunk, nem a fájl tetején!
  const messages = await db.message.findMany({
    include: {
      user: true,
      channel: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 50,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Hash className="text-emerald-500" size={20} />
          <h2 className="font-mono text-sm font-bold text-slate-100 tracking-[0.2em] uppercase">
            Valkyrie_Comm_Link
          </h2>
        </div>
      </div>

      <div className="flex-1 relative z-10 overflow-hidden">
        {/* Szerializáljuk a dátumokat a biztonság kedvéért */}
        <ChatInterface initialMessages={JSON.parse(JSON.stringify(messages))} />
      </div>
    </div>
  );
}