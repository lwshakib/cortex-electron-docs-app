import { _electron as electron } from '@playwright/test';
import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * End-to-End tests for the initial Home/Landing state of the app.
 * Verifies that the branding and primary UI elements are visible on launch.
 */
let electronApp: ElectronApplication;
let window: Page;

test.beforeAll(async () => {
  // Launch Electron with the built main.js
  // The app needs `dist/index.html` to exist, so run `bun run build` first.
  electronApp = await electron.launch({
    args: [
      path.join(__dirname, '../../dist-electron/main.js'),
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  // Wait for the first BrowserWindow to open
  window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
});

test.afterAll(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});

test('app window opens and displays Cortex branding', async () => {
  // The sidebar should show the "Cortex" heading
  const heading = window.locator('h2').filter({ hasText: /^Cortex$/ });
  await expect(heading).toBeVisible({ timeout: 10000 });
});

test('welcome screen is shown when no document is selected', async () => {
  // The main content area should show the welcome text
  const welcomeHeading = window.locator('h1').filter({ hasText: /^Cortex$/ });
  await expect(welcomeHeading).toBeVisible({ timeout: 10000 });

  const welcomeSubtext = window.locator('text=Welcome to Cortex');
  await expect(welcomeSubtext).toBeVisible();
});

test('create new document button is visible', async () => {
  const createButton = window.getByRole('button', {
    name: 'Create new document',
  });
  await expect(createButton).toBeVisible();
});

test('search input is visible and functional', async () => {
  const searchInput = window.locator(
    'input[placeholder="Search documents..."]',
  );
  await expect(searchInput).toBeVisible();

  // Type into search
  await searchInput.fill('test query');
  // The input should have the value
  await expect(searchInput).toHaveValue('test query');

  // Clear it
  await searchInput.fill('');
});
