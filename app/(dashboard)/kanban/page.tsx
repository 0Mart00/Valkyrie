// app/(dashboard)/kanban/page.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { KanbanBoard } from '@/components/kanban/Board';

export default async function KanbanPage() {
  // CSAK ITT IMPORTÁLJUK: Így a builder nem fut bele a Prisma initbe
  const { db } = await import('@/lib/db');

  const project = await db.project.findFirst({
    include: {
      columns: {
        include: {
          tasks: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!project) {
    return (
      <div className="p-20 text-white font-mono uppercase">
        [FATAL_ERROR]: No project data found in database.
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white tracking-tighter italic uppercase underline decoration-emerald-500/50">
          {project.name} // KANBAN_FLOW
        </h1>
      </div>
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard initialData={project} projectId={project.id} />
      </div>
    </div>
  );
}