import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createDoc,
  deleteDoc,
  getFileContent,
  loadDocs,
  saveFileContent,
  searchDocuments,
  updateDoc,
} from "./lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

// Platform-specific icon paths
const getIconPath = (): string => {
  const platform = process.platform;
  const basePath = process.env.APP_ROOT;

  switch (platform) {
    case "win32":
      return path.join(basePath, "public", "icons", "win", "icon.ico");
    case "darwin":
      return path.join(basePath, "public", "icons", "mac", "icon.icns");
    case "linux":
    default:
      return path.join(basePath, "public", "icons", "png", "256x256.png");
  }
};

const iconPath = getIconPath();

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    center: true,
    title: "Cortex - Notes App",
    frame: false,
    vibrancy: "under-window",
    visualEffectState: "active",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 10 },
    transparent: true,
    // backgroundColor: "#00000000",
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  win.on("ready-to-show", () => {
    win?.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  ipcMain.handle("give-me-docs", async () => {
    const docs = await loadDocs();
    return docs;
  });

  ipcMain.handle("create-doc", async (_, args) => {
    return await createDoc(args);
  });

  ipcMain.handle("delete-doc", async (_, args) => {
    return await deleteDoc(args);
  });

  ipcMain.handle("update-doc", async (_, args) => {
    return await updateDoc(args);
  });

  ipcMain.handle("get-file-content", async (_, args) => {
    return await getFileContent(args);
  });

  ipcMain.handle("save-file-content", async (_, args) => {
    return await saveFileContent(args);
  });

  ipcMain.handle("search-documents", async (_, args) => {
    return await searchDocuments(args);
  });

  ipcMain.on("win:minimize", () => {
    win?.minimize();
  });

  ipcMain.on("win:maximize", async () => {
    const isMaximized = win?.isMaximized();
    if (isMaximized) {
      win?.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on("win:close", () => {
    win?.close();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
