// lib/db.ts
//import { PrismaClient } from "@prisma/client";
// Próbáld meg ezt, ha a sima import piros:
//import { PrismaClient } from '.prisma/client'; 
// VAGY maradjon az eredeti, de adjunk neki egy kis segítséget:
import { PrismaClient } from '@prisma/client/index';
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Itt nem konfigurálunk semmi extrát, hagyjuk a bináris motornak
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;