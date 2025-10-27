import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
type TimerStatus = 'idle' | 'running' | 'paused';


interface TimerStore {
  timeRemaining: number; // can be negative
  timerStatus: TimerStatus;
  initialDuration: number;
  startTime: number | null; // timestamp when timer started
  pausedAt: number | null; // timestamp when timer was paused
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setInitialDuration: (duration: number) => void;
  loadSpeakerDuration: (duration: number) => void;
  calculateTimeRemaining: () => number;
}


export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      timeRemaining: 0,
      timerStatus: 'idle',
      initialDuration: 0,
      startTime: null,
      pausedAt: null,

      calculateTimeRemaining: () => {
        const state = get();
        if (state.timerStatus === 'idle' || state.startTime === null) {
          return state.timeRemaining;
        }

        if (state.timerStatus === 'paused' && state.pausedAt !== null) {
          // Return the time when it was paused
          const elapsed = Math.floor((state.pausedAt - state.startTime) / 1000);
          return state.initialDuration - elapsed;
        }

        // Calculate current time for running timer
        const now = Date.now();
        const elapsed = Math.floor((now - state.startTime) / 1000);
        return state.initialDuration - elapsed;
      },

      startTimer: () => {
        const state = get();
        if (state.timerStatus === 'idle' && state.initialDuration > 0) {
          const now = Date.now();
          set({ 
            timerStatus: 'running', 
            startTime: now,
            pausedAt: null,
            timeRemaining: state.initialDuration 
          });
        }
      },

      pauseTimer: () => {
        const state = get();
        if (state.timerStatus === 'running') {
          const now = Date.now();
          const timeRemaining = state.calculateTimeRemaining();
          set({ 
            timerStatus: 'paused',
            pausedAt: now,
            timeRemaining
          });
        }
      },

      resumeTimer: () => {
        const state = get();
        if (state.timerStatus === 'paused') {
          const now = Date.now();
          // Calculate how much time should have elapsed if we had been running
          const timeAtPause = state.timeRemaining;
          // Set new start time as if we started with timeRemaining
          const newStartTime = now - ((state.initialDuration - timeAtPause) * 1000);
          set({ 
            timerStatus: 'running',
            startTime: newStartTime,
            pausedAt: null
          });
        }
      },

      stopTimer: () => {
        set({ 
          timerStatus: 'idle',
          startTime: null,
          pausedAt: null
        });
      },

      resetTimer: () => {
        const state = get();
        set({ 
          timerStatus: 'idle', 
          timeRemaining: state.initialDuration,
          startTime: null,
          pausedAt: null
        });
      },

      tick: () => {
        const state = get();
        if (state.timerStatus === 'running') {
          const timeRemaining = state.calculateTimeRemaining();
          set({ timeRemaining });
        }
      },

      setInitialDuration: (duration) => {
        set({ 
          initialDuration: duration, 
          timeRemaining: duration,
          startTime: null,
          pausedAt: null
        });
      },

      loadSpeakerDuration: (duration) => {
        set({ 
          initialDuration: duration, 
          timeRemaining: duration,
          timerStatus: 'idle',
          startTime: null,
          pausedAt: null
        });
      }
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);