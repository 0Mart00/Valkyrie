// tests/e2e/workflow.spec.ts
import { test, expect } from '@playwright/test';

test('Kanban move triggers chat notification', async ({ page }) => {
  await page.goto('/kanban');

  // 1. Megkeressük a feladatot és áthúzzuk a 'Done' oszlopba
  const task = page.locator('text=Drafting Strategy');
  const doneColumn = page.locator('text=Done');
  await task.dragTo(doneColumn);

  // 2. Navigálunk a Chatre
  await page.click('nav >> text=Chat');

  // 3. Ellenőrizzük, hogy ott van-e az automata üzenet
  const lastMessage = page.locator('.message-list >> last-child');
  await expect(lastMessage).toContainText('✅ MÉRFÖLDKŐ');
});