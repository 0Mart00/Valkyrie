import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    const db = await getDb();

    const user = await db.user.create({
      data: {
        email: email,
        name: name,
        role: "DEV", // A schema.prisma alapján az alapértelmezett
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Adatbázis kapcsolódási hiba:", error.code);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: "Az adatbázis szerver nem elérhető. Ellenőrizd a kapcsolatot!" }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Hiba a regisztráció során" }, { status: 500 });
  }
}