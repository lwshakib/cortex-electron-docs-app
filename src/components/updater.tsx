'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Updater() {
  useEffect(() => {
    const { ipcRenderer } = window;

    if (!ipcRenderer) return;

    const handleUpdateDownloaded = () => {
      toast.success('Update downloaded', {
        description: 'Restart the app to install the latest version.',
        action: {
          label: 'Restart',
          onClick: () => {
            ipcRenderer.invoke('app:quit-and-install');
          },
        },
        duration: Infinity,
      });
    };

    const handleUpdateMessage = (_: unknown, message: string) => {
      console.log('Update message:', message);
    };

    const handleUpdateProgress = (_: unknown, progress: unknown) => {
      console.log('Update progress:', progress);
      // You could show a progress toast here if it's a large update
    };

    ipcRenderer.on('update-downloaded', handleUpdateDownloaded);
    ipcRenderer.on('update-message', handleUpdateMessage);
    ipcRenderer.on('update-download-progress', handleUpdateProgress);

    return () => {
      ipcRenderer.off('update-downloaded', handleUpdateDownloaded);
      ipcRenderer.off('update-message', handleUpdateMessage);
      ipcRenderer.off('update-download-progress', handleUpdateProgress);
    };
  }, []);

  return null;
}
