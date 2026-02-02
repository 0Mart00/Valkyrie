"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  X, 
  FileCode, 
  ImageIcon, 
  Cpu, 
  Terminal, 
  Plus, 
  Shield, 
  Lock, 
  Key,
  Database,
  ShieldAlert,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

// Rendszer kulcsszavak a vizuális kiemeléshez
const KEYWORDS = ["ERROR", "WARNING", "SYSTEM", "Valkyrie", "CRITICAL", "DEPLOY", "SUCCESS", "DB_INIT"];

// Hozzáférési szintek definíciója
const ACCESS_LEVELS = [
  { id: "DEV", label: "Developer (Lvl 1)", color: "text-blue-400", border: "border-blue-500/30" },
  { id: "CYBER_SEC", label: "Cyber Security (Lvl 2)", color: "text-purple-400", border: "border-purple-500/30" },
  { id: "BOSS", label: "Director / Boss (Lvl 3)", color: "text-amber-400", border: "border-amber-500/30" },
];

interface Message {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
  };
}

interface ChatInterfaceProps {
  initialMessages: Message[];
}

export function ChatInterface({ initialMessages }: ChatInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeChannelId = searchParams.get("id");

  // Állapotkezelés
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; preview: string } | null>(null);
  
  // Hozzáférés és Biztonság
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Csatorna létrehozás modál
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [channelForm, setChannelForm] = useState({
    name: "",
    level: "DEV",
    password: ""
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Görgetés az aljára új üzenetnél
  useEffect(() => {
    if (scrollRef.current && isAuthorized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAuthorized]);

  // Csatornaváltáskor újra bekérjük a jelszót
  useEffect(() => {
    if (activeChannelId) {
      setIsAuthorized(false);
      setAuthError(null);
      setAccessKey("");
    } else {
      setIsAuthorized(true);
    }
  }, [activeChannelId]);

  // Szín generálása név alapján
  const getUserColor = (name: string) => {
    const colors = ["text-emerald-400", "text-cyan-400", "text-purple-400", "text-amber-400", "text-rose-400"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Kulcsszó kiemelő logika
  const highlightKeywords = (text: string) => {
    const parts = text.split(new RegExp(`(${KEYWORDS.join("|")})`, "gi"));
    return parts.map((part, index) => 
      KEYWORDS.some(k => k.toLowerCase() === part.toLowerCase()) ? (
        <span key={index} className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Hozzáférés ellenőrzése
  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/channels/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          channelId: activeChannelId, 
          password: accessKey,
          userRole: "DEV" 
        }),
      });

      if (response.ok) {
        setIsAuthorized(true);
        setAccessKey("");
      } else {
        const data = await response.json();
        setAuthError(data.error === "INSUFFICIENT_CLEARANCE" ? "ALACSONY_JOGOSULTSÁG" : "HIBÁS_HOZZÁFÉRÉSI_KULCS");
      }
    } catch (err) {
      setAuthError("HÁLÓZATI_PROTOKOLL_HIBA");
    } finally {
      setIsLoading(false);
    }
  };

  // Új csatorna inicializálása
  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setChannelError(null);
    
    try {
      const response = await fetch("/api/channels/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(channelForm),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Initialization failed at API:", errData);
        throw new Error(errData.error || "Initialization failed");
      }
      
      const newChannel = await response.json();
      setIsModalOpen(false);
      setChannelForm({ name: "", level: "DEV", password: "" });
      
      const systemMsg: Message = {
        id: `sys-${Date.now()}`,
        content: `SYSTEM: Új csatorna aktiválva: ${newChannel.name} [SECURITY_LEVEL: ${channelForm.level}]`,
        createdAt: new Date(),
        user: { id: "system", name: "SYSTEM_CORE" }
      };
      setMessages(prev => [...prev, systemMsg]);
      router.refresh(); 
    } catch (error: any) {
      console.error("Error creating channel:", error);
      setChannelError(error.message || "Ismeretlen hiba történt.");
    } finally {
      setIsLoading(false);
    }
  };

  // Üzenetküldés
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && !attachment) || isLoading) return;
    setIsLoading(true);

    let finalContent = inputValue;
    if (attachment) {
      if (attachment.file.type.startsWith('image/')) {
        finalContent += `\n\n![${attachment.file.name}](${attachment.preview})`;
      } else {
        finalContent += `\n\n[FILE: /var/data/uploads/${attachment.file.name}]`;
      }
    }

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: finalContent,
          channelId: activeChannelId || "main-channel",
          userId: "default-admin-id"
        }),
      });

      if (!response.ok) throw new Error("Send failed");

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setAttachment(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fájl választás kezelő
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAttachment({ file, preview: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  // 1. LAKATOLT ÁLLAPOT (HA NINCS AUTHORIZÁCIÓ)
  if (activeChannelId && !isAuthorized) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-slate-950 animate-in fade-in duration-500">
        <Card className="w-full max-w-sm bg-slate-900/40 border-emerald-500/20 p-8 flex flex-col items-center space-y-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="relative">
            <div className="absolute -inset-6 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
            <Lock className="text-emerald-500 relative" size={48} />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-mono text-emerald-400 text-sm font-bold tracking-[0.3em] uppercase">Node_Access_Required</h3>
            <p className="text-[10px] text-slate-500 font-mono italic">{"[ TERMINAL_SECURED_BY_VALKYRIE_PROTOCOL ]"}</p>
          </div>

          <form onSubmit={handleAccessSubmit} className="w-full space-y-4">
            <div className="relative group">
              <Key className="absolute left-3 top-3 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={14} />
              <input 
                type="password"
                className="w-full bg-black border border-slate-800 rounded px-10 py-3 text-xs font-mono text-emerald-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="ENTER_CRYPT_KEY..."
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="flex items-center gap-2 text-rose-500 font-mono text-[9px] bg-rose-500/10 p-2 rounded border border-rose-500/20 animate-shake">
                <ShieldAlert size={12} />
                <span>{authError}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || !accessKey}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs h-11 shadow-[0_0_20px_rgba(16,185,129,0.2)] group"
            >
              {isLoading ? <Cpu className="animate-spin mr-2" size={14} /> : (
                <span className="flex items-center gap-2">
                  VALIDATE_IDENTITY
                  <Terminal size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
  <div className="flex flex-col h-full bg-slate-950/50 relative">
    {/* Rendszer Vezérlő Sáv */}
    <div className="px-4 py-2 border-b border-slate-900 bg-slate-900/20 flex justify-between items-center z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <Terminal size={12} className="text-emerald-500" />
          <span>SESSION_NODE: ACTIVE</span>
        </div>
        {isAuthorized && activeChannelId && (
          <div className="flex items-center px-1.5 h-5 text-[9px] border border-emerald-500/30 text-emerald-400 font-mono bg-emerald-500/5 rounded uppercase tracking-tighter">
            ENCRYPTED_LINK
          </div>
        )}
      </div>
      <Button 
        onClick={() => {
          setChannelError(null);
          setIsModalOpen(true);
        }}
        variant="outline" 
        size="sm" 
        className="h-7 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 text-[10px] font-mono"
      >
        <Plus size={12} className="mr-2" />
        NEW_CHANNEL_INIT
      </Button>
    </div>

      {/* ÜZENETEK LISTA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-sm space-y-4 min-h-[300px]">
            <div className="animate-pulse text-emerald-500/50">{"[ WAITING_FOR_DATA_STREAM ]"}</div>
            <p className="text-xs uppercase tracking-widest opacity-50 text-center px-4">
              A csatorna üres. Indíts üzenetküldést a terminálon keresztül.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.user.id === "default-admin-id" || msg.user.name === "Valkyrie Admin";
            const userColor = getUserColor(msg.user.name);
            const isSystem = msg.user.id === "system";

            return (
              <div 
                key={msg.id || idx} 
                className={`flex gap-4 ${isMe ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {!isSystem && (
                  <Avatar className={`w-10 h-10 border-2 ${isMe ? "border-emerald-500" : "border-slate-800"}`}>
                    <AvatarImage src={msg.user.image || undefined} />
                    <AvatarFallback className="bg-slate-900 text-slate-200 font-mono text-xs">
                      {msg.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`text-[10px] font-mono font-bold ${userColor}`}>
                      {msg.user.name}
                    </span>
                    {!isSystem && (
                      <Badge variant="outline" className="h-4 text-[8px] font-mono border-slate-800 text-slate-600 px-1 uppercase tracking-tighter">
                        {msg.user.role || "LVL_1"}
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-700 font-mono">
                     {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <Card className={`p-3 border backdrop-blur-md ${
                    isSystem ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 italic text-xs w-full text-center py-2" :
                    isMe ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-100" : 
                    "bg-slate-900/50 border-slate-800 text-slate-300 shadow-xl"
                  }`}>
                    {msg.content.split(/(!\[.*?\]\(.*?\))/g).map((part, i) => {
                      const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
                      if (imageMatch) {
                        return (
                          <div key={i} className="my-2 rounded-lg overflow-hidden border border-slate-700 bg-black/50 group/img relative">
                            <div className="bg-slate-900/90 px-2 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-2 border-b border-slate-800">
                              <ImageIcon size={10} />
                              <span>/var/data/uploads/{imageMatch[1] || "unknown.png"}</span>
                            </div>
                            <img 
                              src={imageMatch[2] || undefined} 
                              alt="attachment" 
                              className="max-w-full h-auto object-cover max-h-72" 
                            />
                          </div>
                        );
                      }
                      if (!part.trim()) return null;
                      return (
                        <div key={i} className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {highlightKeywords(part)}
                        </div>
                      );
                    })}
                  </Card>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* BEVITELI MEZŐ */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-900 z-20 backdrop-blur-xl">
        {attachment && (
          <div className="mb-3 flex items-center gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/30 w-fit animate-in slide-in-from-bottom-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-800">
              {attachment.file.type.startsWith('image/') ? (
                <img src={attachment.preview || undefined} className="w-full h-full object-cover" />
              ) : (
                <FileCode size={16} className="text-emerald-500" />
              )}
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Storage_Path</span>
              <span className="text-xs font-mono text-emerald-400">~/uploads/{attachment.file.name}</span>
            </div>
            <button 
              onClick={() => setAttachment(null)}
              className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.txt,.md,.json"
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-emerald-400 hover:bg-slate-900 shrink-0 h-10 w-10"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </Button>

          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
            <input
              autoFocus
              className="relative w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono text-sm placeholder:text-slate-700"
              placeholder="Enter system command or message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3.5 text-[9px] text-slate-700 font-mono pointer-events-none uppercase tracking-widest">
              Terminal_Input
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || (!inputValue && !attachment)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all h-11 w-11 p-0"
          >
            {isLoading ? <Cpu className="animate-spin" size={20} /> : <Send size={20} />}
          </Button>
        </form>
      </div>

      {/* MODÁLIS ABLAK: Csatorna létrehozás */}
      {isModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-slate-900 border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>
            
            <form onSubmit={handleCreateChannel} className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="text-emerald-500" size={18} />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-[0.2em]">Initial_New_Node</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} type="button" className="text-slate-600 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Node_Identifier</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 text-slate-700" size={14} />
                    <input 
                      required
                      className="w-full bg-black border border-slate-800 rounded px-10 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
                      placeholder="e.g. secure_ops"
                      value={channelForm.name}
                      onChange={e => setChannelForm({...channelForm, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Access_Clearance</label>
                  <div className="grid grid-cols-1 gap-2">
                    {ACCESS_LEVELS.map(lvl => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setChannelForm({...channelForm, level: lvl.id})}
                        className={`flex items-center justify-between px-3 py-2.5 rounded border text-[11px] font-mono transition-all ${
                          channelForm.level === lvl.id 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                            : "bg-black border-slate-900 text-slate-600 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield size={14} className={lvl.color} />
                          {lvl.label}
                        </div>
                        {channelForm.level === lvl.id && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Encryption_Key</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-700" size={14} />
                    <input 
                      type="password"
                      required
                      className="w-full bg-black border border-slate-800 rounded px-10 py-2.5 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-500/50"
                      placeholder="Enter access password..."
                      value={channelForm.password}
                      onChange={e => setChannelForm({...channelForm, password: e.target.value})}
                    />
                  </div>
                </div>

                {channelError && (
                  <div className="flex items-center gap-2 text-rose-500 font-mono text-[9px] bg-rose-500/10 p-2 rounded border border-rose-500/20">
                    <ShieldAlert size={12} />
                    <span>{channelError}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-slate-600 hover:text-white font-mono text-[10px] uppercase border border-transparent hover:border-slate-800"
                >
                  Abort_Task
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] uppercase"
                >
                  {isLoading ? "Initing..." : "Execute_Init"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}