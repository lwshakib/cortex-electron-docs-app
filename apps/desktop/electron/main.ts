import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDoc,
  deleteDoc,
  getFileContent,
  loadDocs,
  saveFileContent,
  searchDocuments,
  updateDoc,
} from './lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Define the application root path, which is one level up from the current directory
 * (pointing to the root of the project where 'dist' and 'package.json' reside).
 */
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

// Platform-specific icon paths
/**
 * Utility function to get the correct icon path based on the current operating system.
 */
const getIconPath = (): string => {
  const platform = process.platform;
  const basePath = process.env.APP_ROOT;

  switch (platform) {
    case 'win32':
      return path.join(basePath, 'public', 'icons', 'win', 'icon.ico');
    case 'darwin':
      return path.join(basePath, 'public', 'icons', 'mac', 'icon.icns');
    case 'linux':
    default:
      return path.join(basePath, 'public', 'icons', 'png', '256x256.png');
  }
};

const iconPath = getIconPath();

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

/**
 * Main function to initialize and create the browser window.
 */
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false, // Initially hidden to prevent white flash
    autoHideMenuBar: true,
    center: true,
    title: 'Cortex - Notes App',
    frame: false, // Frameless for custom title bar
    vibrancy: 'under-window', // macOS glass effect
    visualEffectState: 'active',
    titleBarStyle: 'hidden', // Required for frameless macOS window
    trafficLightPosition: { x: 15, y: 10 },
    transparent: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // Important for secure IPC
      sandbox: true, // Recommended for security
      contextIsolation: true, // Prevents renderer from accessing Electron internals
    },
  });

  win.on('ready-to-show', () => {
    win?.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // --- Document Management IPC Handlers ---
  // These map UI requests to the file system operations in ./lib/index.ts

  ipcMain.handle('give-me-docs', async () => {
    const docs = await loadDocs();
    return docs;
  });

  ipcMain.handle('create-doc', async (_, args) => {
    return await createDoc(args);
  });

  ipcMain.handle('delete-doc', async (_, args) => {
    return await deleteDoc(args);
  });

  ipcMain.handle('update-doc', async (_, args) => {
    return await updateDoc(args);
  });

  ipcMain.handle('get-file-content', async (_, args) => {
    return await getFileContent(args);
  });

  ipcMain.handle('save-file-content', async (_, args) => {
    return await saveFileContent(args);
  });

  ipcMain.handle('search-documents', async (_, args) => {
    return await searchDocuments(args);
  });

  // --- Window Control IPC Listeners ---

  ipcMain.on('win:minimize', () => {
    win?.minimize();
  });

  ipcMain.on('win:maximize', async () => {
    const isMaximized = win?.isMaximized();
    if (isMaximized) {
      win?.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on('win:close', () => {
    win?.close();
  });

  // --- Auto Updater Events ---
  // Listen for update events and relay them to the renderer (UI)

  autoUpdater.on('checking-for-update', () => {
    win?.webContents.send('update-message', 'Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('update-message', 'Update available.', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    win?.webContents.send('update-message', 'Update not available.', info);
  });

  autoUpdater.on('error', (err) => {
    win?.webContents.send('update-message', `Error in auto-updater. ${err}`);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('update-download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    win?.webContents.send('update-downloaded', info);
  });

  /**
   * Final hook triggered by the user to restart and install the new version.
   */
  ipcMain.handle('app:quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win?.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Check for updates
  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
