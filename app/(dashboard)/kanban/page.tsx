import { getDb } from "@/lib/db";
import { KanbanBoard } from "@/components/kanban/Board";

export default async function KanbanPage() {
  const db = await getDb();
  
  // Megkeressük az első projektet és az oszlopait a feladatokkal együtt
  const project = await db.project.findFirst({
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            include: { assignee: true }
          }
        }
      }
    }
  });

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-emerald-500 font-mono">
        [FATAL_ERROR]: No project data found. Kérlek futtasd: npx prisma db seed
      </div>
    );
  }

  return (
    <div className="p-6 h-full bg-slate-950">
      <h1 className="text-2xl font-bold text-white mb-6 italic tracking-tighter">
        {project.name} // BOARD_CONTROL
      </h1>
      <KanbanBoard initialData={project} projectId={project.id} />
    </div>
  );
}