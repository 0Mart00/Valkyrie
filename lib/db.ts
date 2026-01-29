import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Valkyrie System - Database Access Layer (Prisma 7 + Pg Adapter)
 * Ez a modul az @prisma/adapter-pg használatával biztosítja a natív Postgres 
 * kapcsolatot, elkerülve a P1012 konfigurációs hibát.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Adatbázis kliens lekérése szingleton mintával.
 * Az adapter átadása biztosítja a kompatibilitást az új Prisma konfigurációs szabályokkal.
 */
export const getDb = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Natív Postgres pool létrehozása a környezeti változóból
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  const adapter = new PrismaPg(pool);

  // A kliens példányosítása az adapterrel
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // Fejlesztői környezetben megőrizzük a példányt a hot-reload túléléséhez
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  
  return client;
};

// Közvetlen export a kényelmes használathoz
export const db = getDb();