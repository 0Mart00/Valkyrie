// tests/integration/task-chat.test.ts
import { it, expect, describe, vi } from 'vitest';
import { handleTaskUpdate } from '@/app/api/tasks/update/route';

describe('Kanban -> Chat Integration', () => {
  it('should create a system message when a task is moved to Done', async () => {
    // 1. Mockoljuk a Prisma hívásokat
    const mockTask = { id: '1', title: 'Test Task', column: { title: 'Done' } };
    
    // 2. Futtatjuk a logikát (a fentebb írt API route logikája)
    const result = await simulateTaskMove('1', 'done-column-id');

    // 3. Ellenőrzés: Létrejött-e az üzenet?
    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: expect.stringContaining('✅ MÉRFÖLDKŐ')
        })
      })
    );
  });
});