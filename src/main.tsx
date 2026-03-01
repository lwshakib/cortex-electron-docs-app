import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import DocumentProvider from './context/document-provider';
import './index.css';
import { Toaster } from './components/ui/sonner.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='electron-vite-theme'>
      <DocumentProvider>
        <App />
        <Toaster />
      </DocumentProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
