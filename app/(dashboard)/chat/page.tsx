// app/(dashboard)/chat/page.tsx
import React from 'react';

export default function ChatPage() {
  
  return (
    <div className="flex flex-col h-full p-6 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Chat Engine</h1>
      <div className="flex-1 border border-slate-700 rounded-lg p-4 bg-slate-950/50">
        <p className="text-slate-500 italic">Üzenetek betöltése...</p>
      </div>
      <div className="mt-4">
        <input 
          type="text" 
          placeholder="Üzenet írása..." 
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded-md outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}