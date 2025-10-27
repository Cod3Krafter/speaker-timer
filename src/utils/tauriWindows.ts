import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const isTauri = '__TAURI_INTERNALS__' in window;

export async function openPublicDisplay() {
  if (!isTauri) {
    // In browser, open a new tab
    window.open('/display', '_blank');
    return;
  }

  try {
    // Check if window already exists
    const windows = WebviewWindow.getAll();
    const existingWindow = (await windows).find((w: WebviewWindow) => w.label === 'public-display');
    
    if (existingWindow) {
      await existingWindow.setFocus();
      return;
    }

    // Create new window
    const webview = new WebviewWindow('public-display', {
      url: '/display',
      title: 'Speaker Timer - Public Display',
      width: 1920,
      height: 1080,
      resizable: true,
      fullscreen: false,
      alwaysOnTop: false,
    });

    // Listen for window creation
    await webview.once('tauri://created', () => {
      console.log('Public display window created');
    });

    await webview.once('tauri://error', (e) => {
      console.error('Error creating window:', e);
    });
  } catch (error) {
    console.error('Failed to open public display:', error);
  }
}

// Storage event synchronization helper
export function setupStorageSync() {
  if (!isTauri) return;

  // Listen for storage events from other windows
  window.addEventListener('storage', (e) => {
    console.log('Storage event received:', e.key);
  });
}