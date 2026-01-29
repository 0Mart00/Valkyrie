import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const db = getDb();
  try {
    const { channelId, password, userRole } = await req.json();

    const channel = await db.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel) return NextResponse.json({ error: "NODE_NOT_FOUND" }, { status: 404 });

    // Egyszerű jelszó és szint ellenőrzés
    // Megjegyzés: Éles rendszerben a jelszót hash-elni kell!
    const isAuthorized = channel.password === password;
    
    // Szint ellenőrzés (Lvl 3 beléphet mindenhova, Lvl 1 csak a DEV csatornákba stb.)
    const roleLevels: Record<string, number> = { "DEV": 1, "CYBER_SEC": 2, "BOSS": 3 };
    const requiredLevel = roleLevels[channel.level] || 1;
    const userLevel = roleLevels[userRole] || 1;

    if (!isAuthorized) {
      return NextResponse.json({ error: "INVALID_ACCESS_KEY" }, { status: 403 });
    }

    if (userLevel < requiredLevel) {
      return NextResponse.json({ error: "INSUFFICIENT_CLEARANCE" }, { status: 403 });
    }

    return NextResponse.json({ status: "ACCESS_GRANTED" });
  } catch (error) {
    return NextResponse.json({ error: "AUTH_PROTOCOL_FAILED" }, { status: 500 });
  }
}