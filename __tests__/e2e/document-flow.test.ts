import { _electron as electron } from '@playwright/test';
import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let electronApp: ElectronApplication;
let window: Page;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, '../../dist-electron/main.js')],
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
});

test.afterAll(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});

test('should create a new document', async () => {
  // Click the "Create new document" button
  const createButton = window.getByRole('button', {
    name: 'Create new document',
  });
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();

  // Wait for the new document to appear in the sidebar
  const untitledDoc = window.locator('text=Untitled Document').first();
  await expect(untitledDoc).toBeVisible({ timeout: 5000 });
});

test('should select and edit a document title', async () => {
  // Click on the "Untitled Document" we just created
  const untitledDoc = window.locator('text=Untitled Document').first();
  await untitledDoc.click();

  // The title input should now be visible and populated
  const titleInput = window.locator('input[placeholder="Note title..."]');
  await expect(titleInput).toBeVisible({ timeout: 5000 });
  await expect(titleInput).toHaveValue('Untitled Document');

  // Change the title
  await titleInput.fill('My Test Document');
  await expect(titleInput).toHaveValue('My Test Document');
});

test('should delete a document', async () => {
  // Hover over the document to reveal the delete icon
  const docItem = window.locator('text=My Test Document').first();
  await docItem.hover();

  // Click the trash icon (it appears on hover)
  const trashIcon = window.locator('.lucide-trash2').first();
  await trashIcon.click();

  // The confirmation dialog should appear
  const deleteConfirmButton = window
    .locator('button:has-text("Delete")')
    .last();
  await expect(deleteConfirmButton).toBeVisible({ timeout: 5000 });
  await deleteConfirmButton.click();

  // Document should no longer be visible
  await expect(window.locator('text=My Test Document')).not.toBeVisible({
    timeout: 5000,
  });
});
