// app/api/tasks/update/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Kényszerítsük a Node.js-t az Edge helyett

import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  // CSAK ITT IMPORTÁLJUK: Így build közben nem fut le a Prisma init
  const { db } = await import('@/lib/db');

  try {
    const { taskId, newColumnId } = await req.json();
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Build-time bypass or DB error" }, { status: 500 });
  }
}