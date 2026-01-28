// app/api/chat/send/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db'; // Győződj meg róla, hogy az import helyes

export async function POST(req: Request) {
  // A db változót közvetlenül a függvény visszatérési értékeként kapod meg
  const db = getDb(); 
  
  try {
    const { content, image } = await req.json();

    // A kép opcionális kezelése a tartalomban
    const finalContent = image ? `${content}\n\n![Image](${image})` : content;

    // Keressünk egy érvényes csatornát és felhasználót a mentéshez
    const channel = await db.channel.findFirst();
    const user = await db.user.findFirst();

    if (!channel || !user) {
      return NextResponse.json({ error: "MISSING_NODE_DATA" }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        content: finalContent,
        channelId: channel.id,
        userId: user.id,
      },
      include: {
        user: true
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("CHAT_SEND_ERROR:", error);
    return NextResponse.json({ error: "FAILED_TO_SEND" }, { status: 500 });
  }
}