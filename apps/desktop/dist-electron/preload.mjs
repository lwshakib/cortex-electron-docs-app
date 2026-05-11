"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  /**
   * Listens for messages from the Main process on a specific channel.
   */
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  /**
   * Removes a specific listener from a channel.
   */
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  /**
   * Sends a one-way message to the Main process.
   */
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  /**
   * Sends an asynchronous request to the Main process and waits for a response.
   * This is the preferred way to call the file system functions in lib/index.ts.
   */
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
