"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  initialData: {
    columns: {
      id: string;
      title: string;
      wipLimit?: number | null;
      tasks: any[];
    }[];
  };
  projectId: string;
}

export const KanbanBoard = ({ initialData, projectId }: KanbanBoardProps) => {
  const queryClient = useQueryClient();

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Meghatározzuk az új státuszt az oszlop azonosítója alapján
    // Ha az oszlop ID megegyezik a státusz nevével (pl. "IN_PROGRESS")
    const newStatus = destination.droppableId;

    try {
      // Backend hívás a korábban megírt API-hoz
      const response = await fetch('/api/tasks/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: draggableId,
          status: newStatus,
          // Itt adhatunk át további adatokat, pl. ha automatikusan feloldunk egy blokkolást mozgatásnál
        })
      });

      if (!response.ok) throw new Error("Sikertelen frissítés");

      // Cache érvénytelenítés a friss adatokért
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    } catch (error) {
      console.error("Board Update Error:", error);
      // Itt érdemes egy Toast üzenetet küldeni a felhasználónak
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-[calc(100vh-12rem)] gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {initialData.columns.map((column) => {
          const isOverWipLimit = column.wipLimit && column.tasks.length > column.wipLimit;

          return (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
              {/* Oszlop Fejléc PM információkkal */}
              <div className={cn(
                "mb-4 p-3 rounded-lg border-t-4 flex justify-between items-center transition-colors",
                isOverWipLimit ? "bg-red-500/10 border-t-red-600" : "bg-slate-900/50 border-t-emerald-500"
              )}>
                <h3 className="font-mono text-xs font-bold text-slate-100 tracking-widest uppercase">
                  {column.title}
                </h3>
                <div className={cn(
                  "text-[10px] font-mono px-2 py-1 rounded",
                  isOverWipLimit ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"
                )}>
                  {column.tasks.length} / {column.wipLimit || "∞"}
                </div>
              </div>

              {/* Droppable Terület */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 rounded-xl p-3 transition-all min-h-[200px] border border-dashed",
                      snapshot.isDraggingOver ? "bg-emerald-500/5 border-emerald-500/50" : "bg-transparent border-slate-800/50"
                    )}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "mb-3 transition-transform",
                              snapshot.isDragging ? "rotate-2 scale-105" : ""
                            )}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};