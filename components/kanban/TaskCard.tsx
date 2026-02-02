"use client";

import { Task, TaskType } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Figyelem: Futasd le az 'npm install date-fns' parancsot!
// Bár itt most nem használtuk közvetlenül a formatDistanceToNow-t, 
// az aging logikához a natív Date is megfelel, ha nem akarsz plusz függőséget.

interface TaskCardProps {
  // A 'any' használata ajánlott, ha a Prisma generált típusai 
  // és a komponensbe érkező JSON adatok (pl. dátum stringek) eltérnek.
  task: any; 
}

export function TaskCard({ task }: TaskCardProps) {
  // Aging kiszámítása (ha több mint 3 napja van folyamatban)
  const isAging = task.startedAt 
    ? (new Date().getTime() - new Date(task.startedAt).getTime()) > 3 * 24 * 60 * 60 * 1000 
    : false;

  // Határidő közelsége (24 órán belül)
  const isUrgent = task.dueDate 
    ? (new Date(task.dueDate).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000
    : false;

  // Ikon térkép
  const typeIcons: Record<string, React.ReactNode> = {
    TASK: <CheckCircle2 className="w-4 h-4" />,
    BUG: <AlertCircle className="w-4 h-4 text-red-500" />,
    DEADLINE: <Clock className="w-4 h-4 text-orange-500" />,
    DECISION: <MessageSquare className="w-4 h-4 text-blue-500" />,
    MEETING: <Clock className="w-4 h-4" />,
    APPROVAL: <ShieldAlert className="w-4 h-4 text-purple-500" />,
    RISK: <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />,
    REVIEW: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  };

  return (
    <Card className={cn(
      "p-4 mb-3 cursor-grab active:cursor-grabbing transition-all border-l-4 shadow-sm",
      "bg-slate-900/80 border-slate-800 hover:border-slate-700",
      task.isBlocked && "border-l-red-600 ring-1 ring-red-600/50 bg-red-950/20",
      !task.isBlocked && isUrgent && "border-l-orange-500 animate-pulse",
      !task.isBlocked && !isUrgent && "border-l-emerald-500",
      isAging && "opacity-70 grayscale-[0.5]"
    )}>
      <div className="flex justify-between items-start mb-2">
        {/* Badge javítás: ha a 'variant' hibát dob, használj sima className-t */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-[10px] font-mono text-slate-300 uppercase">
          {typeIcons[task.type as string] || typeIcons.TASK}
          {task.type}
        </div>
        
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tighter",
          task.priority === "P1" || task.priority === "CRITICAL" 
            ? "bg-red-500 text-white" 
            : "bg-slate-800 text-slate-400"
        )}>
          {task.priority}
        </span>
      </div>

      <h4 className="font-semibold text-sm mb-2 text-slate-100 leading-tight">
        {task.title}
      </h4>

      {task.isBlocked && (
        <div className="text-[10px] text-red-400 font-mono mb-2 bg-red-500/10 p-2 rounded border border-red-500/20 flex items-start gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>BLOCKER: {task.blockerReason || "Nincs megadva ok"}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-emerald-500 shadow-inner">
            {task.assignee?.name?.slice(0, 2).toUpperCase() || task.assigneeId?.slice(0, 2).toUpperCase() || "??"}
          </div>
          {/* Lucide ikonoknál nincs 'title' prop, helyette simán az ikon marad */}
          {isAging && <Clock className="w-3 h-3 text-amber-500/70" />}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-[10px] font-mono",
              isUrgent ? "text-orange-500 font-bold" : "text-slate-500"
            )}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}