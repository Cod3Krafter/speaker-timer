import { useEffect, useState } from 'react';

/**
 * Hook to force store re-hydration when storage events occur
 * This ensures display windows update when control window changes data
 */
export function useSyncStore(storageKey: string, rehydrate: () => void) {
  const [syncTrigger, setSyncTrigger] = useState(0);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        console.log(`Storage sync detected for ${storageKey}`);
        // Trigger store rehydration
        rehydrate();
        // Force a re-render
        setSyncTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey, rehydrate]);

  return syncTrigger;
}