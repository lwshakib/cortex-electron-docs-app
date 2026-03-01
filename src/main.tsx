import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import DocumentProvider from './context/document-provider';
import './index.css';
import { Toaster } from './components/ui/sonner.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

/**
 * The entry point for the React application.
 * Sets up the provider tree for Theme and Document context.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Provides dark/light theme state across the app */}
    <ThemeProvider defaultTheme='dark' storageKey='electron-vite-theme'>
      {/* Manages document metadata, selection, and file content state */}
      <DocumentProvider>
        <App />
        {/* Global toast notification system */}
        <Toaster />
      </DocumentProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

/**
 * Global IPC listener for messages from the main process.
 * Used for debugging and general communication.
 */
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log('Message from Main process:', message);
});
