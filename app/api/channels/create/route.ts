import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const db = getDb();
  try {
    const body = await req.json();
    const { name, level, password } = body;

    // Itt a javítás: a beküldött 'name' változót használjuk!
    const channel = await db.channel.create({
      data: {
        id: `channel-${Date.now()}`,
        name: name || `csatorna-${Date.now().toString().slice(-4)}`,
        // Mivel a sémában nincs level/password, ezeket metaadatként kezelhetnénk,
        // de a név javítása a legfontosabb most.
      }
    });
    
    return NextResponse.json(channel);
  } catch (error) {
    console.error("API_CHANNEL_CREATE_ERROR:", error);
    return NextResponse.json({ error: "FAILED_TO_CREATE" }, { status: 500 });
  }
}