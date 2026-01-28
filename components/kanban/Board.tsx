// components/kanban/Board.tsx
"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCard } from "./TaskCard";

export const KanbanBoard = ({ initialData, projectId }: any) => {
  const queryClient = useQueryClient();

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimista UI frissítés (State azonnali módosítása backend hívás előtt)
    // ... (itt történik a Zustand vagy React Query cache manipuláció)

    // Backend hívás
    await fetch('/api/tasks/update', {
        method: 'PATCH',
        body: JSON.stringify({
            taskId: draggableId,
            newColumnId: destination.droppableId,
            projectId: projectId
        })
    });
    
    // Cache érvénytelenítés a friss adatokért
    queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto p-4">
        {initialData.columns.map((column: any) => (
          <div key={column.id} className="w-80 flex-shrink-0">
             <h3 className="font-bold mb-2 text-white">{column.title}</h3>
             <Droppable droppableId={column.id}>
               {(provided) => (
                 <div
                   {...provided.droppableProps}
                   ref={provided.innerRef}
                   className="bg-slate-800 p-2 rounded-lg min-h-[100px]"
                 >
                   {column.tasks.map((task: any, index: number) => (
                     <Draggable key={task.id} draggableId={task.id} index={index}>
                       {(provided) => (
                         <div
                           ref={provided.innerRef}
                           {...provided.draggableProps}
                           {...provided.dragHandleProps}
                           className="mb-2"
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
        ))}
      </div>
    </DragDropContext>
  );
};