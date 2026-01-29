import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Alapértelmezett felhasználó létrehozása
  const user = await prisma.user.upsert({
    where: { email: 'admin@valkyrie.local' },
    update: {},
    create: {
      email: 'admin@valkyrie.local',
      name: 'Admin User',
    },
  });

  // Alapértelmezett csatorna létrehozása
  const channel = await prisma.channel.upsert({
    where: { id: 'default-channel' },
    update: {},
    create: {
      id: 'default-channel',
      name: 'általános',
    },
  });

  console.log({ user, channel });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });