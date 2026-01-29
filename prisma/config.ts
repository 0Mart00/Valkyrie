import { defineConfig } from '@prisma/config';

/**
 * Valkyrie System - Prisma 7 Configuration
 * Centralized database management for master-workspace
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});