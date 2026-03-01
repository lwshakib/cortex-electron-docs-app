import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
/**
 * The contextBridge serves as a secure bridge between the isolated Renderer process
 * (your React app) and the Main process (Node.js/Electron).
 *
 * We only expose the specific ipcRenderer methods needed to communicate,
 * preventing the Renderer from having full access to Node.js for security.
 */
contextBridge.exposeInMainWorld('ipcRenderer', {
  /**
   * Listens for messages from the Main process on a specific channel.
   */
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  /**
   * Removes a specific listener from a channel.
   */
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  /**
   * Sends a one-way message to the Main process.
   */
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  /**
   * Sends an asynchronous request to the Main process and waits for a response.
   * This is the preferred way to call the file system functions in lib/index.ts.
   */
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});
