"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Send, Loader2, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ChatInterface({ initialMessages }: { initialMessages: any[] }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [initialMessages]);

  const handleSend = async () => {
    if (!content.trim() && !previewImage) return;
    setIsSending(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, image: previewImage }),
      });

      if (response.ok) {
        setContent("");
        setPreviewImage(null);
        router.refresh();
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderContent = (text: string) => {
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, i) => {
      if (part.startsWith('#')) {
        return <span key={i} className="text-emerald-400 font-mono font-bold italic">{part}</span>;
      }
      return part;
    });
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/50">
        {initialMessages.map((msg) => (
          <div key={msg.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
            <Avatar className="w-8 h-8 border border-slate-800 shrink-0">
              <AvatarImage src={msg.user?.avatarUrl} />
              <AvatarFallback className="bg-slate-900 text-emerald-500 text-[10px]">
                {msg.user?.name?.slice(0, 2).toUpperCase() || "SY"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <span className="text-[10px] font-mono text-slate-500">
                {msg.user?.name || "System"} • {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
              <Card className="p-3 bg-slate-900/40 border-slate-800 text-sm text-slate-300 shadow-lg">
                <div className="whitespace-pre-wrap">{renderContent(msg.content)}</div>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-900 bg-slate-950">
        {previewImage && (
          <div className="mb-3 relative w-24 h-24 border border-emerald-500/50 rounded overflow-hidden">
            <img src={previewImage} className="w-full h-full object-cover" alt="preview" />
            <button onClick={() => setPreviewImage(null)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
              <X size={12} />
            </button>
          </div>
        )}
        <div className="relative bg-slate-900/50 rounded-lg border border-slate-800 focus-within:border-emerald-500/50 transition-all">
          <textarea 
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Üzenet... Használj # hivatkozást" 
            className="w-full bg-transparent p-4 pl-12 pr-16 text-sm outline-none resize-none text-slate-200"
          />
          <div className="absolute left-3 top-4 flex flex-col gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-600 hover:text-emerald-500 transition-colors">
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewImage(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </div>
          <div className="absolute right-3 bottom-3">
            <Button onClick={handleSend} disabled={isSending} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono">
              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}