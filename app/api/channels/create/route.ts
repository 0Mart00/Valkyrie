import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * API végpont új titkosított csatorna létrehozásához.
 * Kezeli a nevet, a biztonsági szintet (Clearance Level) és a jelszót.
 */
export async function POST(req: Request) {
  const db = getDb();
  try {
    const body = await req.json();
    const { name, level, password } = body;

    // Csatorna létrehozása az adatbázisban. 
    // Megjegyzés: A sémának tartalmaznia kell a 'level' és 'password' mezőket a hitelesítéshez.
    const channel = await db.channel.create({
      data: {
        id: `channel-${Date.now()}`,
        name: name || `csatorna-${Date.now().toString().slice(-4)}`,
        // Itt mentjük a biztonsági adatokat a későbbi ellenőrzéshez
        level: level || "DEV",
        password: password || "", 
      }
    });
    
    return NextResponse.json(channel);
  } catch (error) {
    console.error("CRITICAL_ERROR [CHANNEL_INIT]:", error);
    return NextResponse.json({ 
      error: "INITIALIZATION_FAILED", 
      details: "Database sync failed or schema mismatch." 
    }, { status: 500 });
  }
}