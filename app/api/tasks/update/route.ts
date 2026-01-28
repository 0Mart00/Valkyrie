// app/api/tasks/update/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  // A 'db' destruktúrálás helyett a 'getDb' függvényt importáljuk
  const { getDb } = await import('@/lib/db');
  const db = getDb();

  try {
    const { taskId, newColumnId } = await req.json();
    
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId },
    });
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("TASK_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "DATABASE_ERROR" }, { status: 500 });
  }
}