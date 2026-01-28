// prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma', // Itt csak a string kell, nem az objektum!
  datasource: {
    url: process.env.DATABASE_URL,
  },
});