import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getDb = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Natív Postgres pool létrehozása
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)

  // Itt adjuk át az adaptert, amit a hibaüzenet hiányolt
  const client = new PrismaClient({
    adapter,
    log: ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  
  return client;
};