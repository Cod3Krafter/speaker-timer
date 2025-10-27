import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Speaker Interface
export interface Speaker {
  id: string;
  name: string;
  topic: string;
  duration: number; // in seconds
}

// Store State + Actions Interface
export interface SpeakerStore {
  speakers: Speaker[];
  currentSpeakerIndex: number | null;

  addSpeaker: (speaker: Omit<Speaker, "id">) => void;
  deleteSpeaker: (id: string) => void;
  editSpeaker: (id: string, updatedData: Partial<Omit<Speaker, "id">>) => void;
  setCurrentSpeaker: (index: number | null) => void;
  loadNextSpeaker: () => void;
  moveSpeaker: (fromIndex: number, toIndex: number) => void;

  getCurrentSpeaker: () => Speaker | null;
}

// Zustand Store (v5-safe with hack)
export const useSpeakerStore = create<SpeakerStore>()(
  persist(
    (set, get) => ({
      speakers: [],
      currentSpeakerIndex: null,

      addSpeaker: (speaker) => set((state) => ({
        speakers: [...state.speakers, {
          id: Date.now().toString(),
          name: speaker.name,
          topic: speaker.topic,
          duration: speaker.duration
        }]
      })),

      deleteSpeaker: (id) => set((state) => {
        const newSpeakers = state.speakers.filter(s => s.id !== id);
        let newIndex = state.currentSpeakerIndex;
        
        if (newIndex !== null) {
          if (newSpeakers.length === 0) {
            newIndex = null;
          } else if (newIndex >= newSpeakers.length) {
            newIndex = newSpeakers.length - 1;
          }
        }
        
        return {
          speakers: newSpeakers,
          currentSpeakerIndex: newIndex
        };
      }),

      editSpeaker: (id, updatedData) => set((state) => ({
        speakers: state.speakers.map(s => 
          s.id === id ? { ...s, ...updatedData } : s
        )
      })),

      setCurrentSpeaker: (index) => set({ currentSpeakerIndex: index }),

      loadNextSpeaker: () => set((state) => {
        if (state.speakers.length === 0) return state;
        
        const nextIndex = state.currentSpeakerIndex === null 
          ? 0 
          : (state.currentSpeakerIndex + 1) % state.speakers.length;
        
        return { currentSpeakerIndex: nextIndex };
      }),

      moveSpeaker: (fromIndex, toIndex) => set((state) => {
        const newSpeakers = [...state.speakers];
        const [removed] = newSpeakers.splice(fromIndex, 1);
        newSpeakers.splice(toIndex, 0, removed);
        
        let newIndex = state.currentSpeakerIndex;
        if(newIndex !== null){
          if (newIndex === fromIndex) {
            newIndex = toIndex;
          } else if (fromIndex < newIndex && toIndex >= newIndex) {
            newIndex--;
          } else if (fromIndex > newIndex && toIndex <= newIndex) {
            newIndex++;
          }
        }
        
        return {
          speakers: newSpeakers,
          currentSpeakerIndex: newIndex
        };
      }),

      getCurrentSpeaker: () => {
        const state = get();
        if (state.currentSpeakerIndex === null) return null;
        return state.speakers[state.currentSpeakerIndex] || null;
      }
    }),
    {
      name: 'speaker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);