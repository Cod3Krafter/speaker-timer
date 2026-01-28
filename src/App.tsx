import {useState, useEffect, useRef} from 'react';
import { useTimerStore } from './store/useTimerStore';
import { useSpeakerStore } from './store/useSpeakerStore';
import {SpeakerForm} from './components/SpeakerForm';
import {SpeakerList}  from './components/SpeakerList';
import type {Speaker} from './store/useSpeakerStore';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { PublicDisplay } from './components/public-display';
import { openPublicDisplay, isTauri } from './utils/tauriWindows';
import { useSyncStore } from './hooks/useSyncStore';


// Create a broadcast channel for cross-tab/window communication
const timerChannel = new BroadcastChannel('speaker-timer');

type ViewMode = 'control' | 'display';
interface AppProps {
  defaultView?: ViewMode;
}

function App({ defaultView = 'control' }: AppProps) {
  const { loadNextSpeaker, getCurrentSpeaker } = useSpeakerStore();
  const { 
    timeRemaining, 
    timerStatus, 
    startTimer, 
    pauseTimer, 
    resumeTimer,
    stopTimer, 
    resetTimer,
    tick,
    loadSpeakerDuration,
    calculateTimeRemaining
  } = useTimerStore();
  
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [viewMode] = useState<ViewMode>(defaultView);
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useSyncStore('speaker-storage', () => {
    useSpeakerStore.persist.rehydrate();
  });
  
  // Force re-read current speaker when sync happens
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'speaker-storage' && viewMode === 'display') {
        forceUpdate(n => n + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [viewMode]);
  
  const currentSpeaker = getCurrentSpeaker();
  const isInitialMount = useRef(true);

  // Set up broadcast channel communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (viewMode === 'display') {
        switch (type) {
          case 'TIMER_UPDATE':
            setDisplayTime(data.timeRemaining);
            break;
          case 'STATUS_UPDATE':
            // Only update these in display view to prevent loops
            loadSpeakerDuration(data.duration);
            // Update timer status in Zustand store
            useTimerStore.setState({
              timerStatus: data.timerStatus,
              timeRemaining: data.timeRemaining,
              startTime: data.startTime,
              pausedAt: data.pausedAt,
              initialDuration: data.duration
            });
            break;
        }
      }
    };

    timerChannel.addEventListener('message', handleMessage);
    return () => {
      timerChannel.removeEventListener('message', handleMessage);
    };
  }, [viewMode, loadSpeakerDuration]);

  // Listen for localStorage changes (works in both browser tabs and Tauri windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Storage event will trigger Zustand to re-hydrate automatically
      // Force a recalculation of display time
      if (e.key === 'timer-storage' || e.key === 'speaker-storage') {
        const currentTime = calculateTimeRemaining();
        setDisplayTime(currentTime);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [calculateTimeRemaining]);

  // Broadcast updates from control view
  useEffect(() => {
    if (viewMode === 'control') {
      // Combine timer and status updates into a single message
      timerChannel.postMessage({
        type: 'STATUS_UPDATE',
        data: {
          timeRemaining: displayTime,
          duration: currentSpeaker?.duration || 0,
          timerStatus,
          startTime: useTimerStore.getState().startTime,
          pausedAt: useTimerStore.getState().pausedAt
        }
      });
    }
  }, [displayTime, currentSpeaker, viewMode, timerStatus]);

  // Update display time on every tick
  useEffect(() => {
    if (timerStatus === 'running' || timerStatus === 'paused') {
      const currentTime = calculateTimeRemaining();
      setDisplayTime(currentTime);
    } else {
      setDisplayTime(timeRemaining);
    }
  }, [timeRemaining, timerStatus, calculateTimeRemaining]);

  // Recalculate time on mount (for page refresh)
  useEffect(() => {
    if (timerStatus === 'running') {
      const currentTime = calculateTimeRemaining();
      setDisplayTime(currentTime);
    }
  }, [calculateTimeRemaining, timerStatus]);

  // Timer tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timerStatus === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus, tick]);

  // Load speaker duration when current speaker changes
  useEffect(() => {
    // Skip on initial mount (page refresh)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (currentSpeaker && timerStatus === 'idle') {
      loadSpeakerDuration(currentSpeaker.duration);
    }
  }, [currentSpeaker, timerStatus, loadSpeakerDuration]);

  const handleLoadNextSpeaker = () => {
    // Stop the current timer before loading next speaker
    stopTimer();
    loadNextSpeaker();
  };

  const handleOpenDisplay = () => {
  if (isTauri) {
    openPublicDisplay();
  } else {
    window.open('/display', '_blank');
  }
};

  // Display View
  if (viewMode === 'display') {
    return (
      <div className="relative">
        <PublicDisplay 
          speaker={currentSpeaker} 
          timeRemaining={displayTime} 
          timerStatus={timerStatus}
        />
      </div>
    );
  }




  // Control View
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Speaker Timer Control
            </h1>
            {isTauri && (
              <p className="text-sm text-gray-500">Running in Tauri Desktop App</p>
            )}
          </div>
          <div className="flex gap-3">
            {!isTauri && (
              <a
                href="https://github.com/nicholasadamou/speaker-timer/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Desktop App
              </a>
            )}
            <button
              type="button"
              onClick={handleOpenDisplay}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              Open Display View
            </button>
          </div>
        </div>

        {/* Timer Section */}
        {currentSpeaker && (
          <div className="mb-6">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{currentSpeaker.name}</h2>
                  <p className="text-lg opacity-90">{currentSpeaker.topic}</p>
                </div>
                <button
                  onClick={handleLoadNextSpeaker}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
                >
                  Load Next Speaker →
                </button>
              </div>
            </div>

            <TimerDisplay timeRemaining={displayTime} timerStatus={timerStatus} />
            
            <div className="mt-6">
              <TimerControls
                timerStatus={timerStatus}
                hasActiveSpeaker={!!currentSpeaker}
                onStart={startTimer}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onStop={stopTimer}
                onReset={resetTimer}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <SpeakerForm 
              editingSpeaker={editingSpeaker} 
              onCancel={() => setEditingSpeaker(null)}
            />
          </div>

          <div>
            {!currentSpeaker && (
              <div className="bg-gray-200 rounded-lg shadow-md p-6 h-full flex flex-col items-center justify-center text-center">
                <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Speaker</h3>
                <p className="text-gray-500 mb-4">Add speakers and load one to start the timer</p>
                <button
                  onClick={loadNextSpeaker}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!getCurrentSpeaker}
                >
                  Load First Speaker
                </button>
              </div>
            )}
          </div>
        </div>

        <SpeakerList onEditSpeaker={setEditingSpeaker} />
      </div>
    </div>
  );
}

export default App;