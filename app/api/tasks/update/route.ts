import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { taskId, status, isBlocked, blockerReason } = await req.json();
    const db = await getDb();

    const updateData: any = { status, isBlocked, blockerReason };

    // Ha most kerül folyamatba, rögzítjük az időpontot az aging számításhoz
    if (status === "IN_PROGRESS") {
      updateData.startedAt = new Date();
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}