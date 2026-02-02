// prisma/seed.ts
import { getDb } from '../lib/db'; // Importáljuk a projekt saját db elérését

async function main() {
  console.log("--- SEED FOLYAMAT INDÍTÁSA ---");
  
  // A getDb() gondoskodik a helyes konfiguráció betöltéséről
  const db = await getDb();

  // 1. Alapértelmezett felhasználó
  const user = await db.user.upsert({
    where: { email: 'admin@valkyrie.local' },
    update: {},
    create: {
      email: 'admin@valkyrie.local',
      name: 'Admin User',
      role: 'DEV',
    },
  });
  console.log("✔ Felhasználó kész:", user.email);

  // 2. Alapértelmezett csatorna
  await db.channel.upsert({
    where: { id: 'default-channel' },
    update: {},
    create: {
      id: 'default-channel',
      name: 'általános',
      type: 'GLOBAL',
    },
  });

  // 3. Projekt és Kanban oszlopok
  const project = await db.project.create({
    data: {
      name: 'VALKYRIE_CORE_SYSTEM',
      columns: {
        create: [
          { title: 'Backlog', order: 0, wipLimit: 10 },
          { title: 'To Do', order: 1, wipLimit: 5 },
          { title: 'In Progress', order: 2, wipLimit: 3 },
          { title: 'Review', order: 3, wipLimit: 4 },
          { title: 'Done', order: 4, wipLimit: null },
        ],
      },
    },
    include: { columns: true }
  });
  console.log("✔ Kanban projekt és oszlopok kész");

  // 4. Teszt feladat
  const toDoColumn = project.columns.find(c => c.title === 'To Do');
  if (toDoColumn) {
    await db.task.create({
      data: {
        title: 'Rendszer tesztelés',
        description: 'Ellenőrizni kell az adatbázis kapcsolatot.',
        status: 'TODO',
        priority: 'P1',
        type: 'TASK',
        columnId: toDoColumn.id,
        assigneeId: user.id,
      },
    });
  }

  console.log("--- SEED SIKERESEN BEFEJEZŐDÖTT ---");
}

main()
  .catch((e) => {
    console.error("❌ Seed hiba:", e);
    process.exit(1);
  });
  // A lezárást a getDb() / Prisma config kezeli, vagy elhagyható