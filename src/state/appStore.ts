import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AngaType, JatiType, LaghuJatiCount, TalaTemplate } from '../domain/models';
import { getLaghuBeatCount } from '../domain/tala';
import { defaultPlayerSettings, defaultSoundSettings, defaultTemplate } from './mockData';

const FALLBACK_STORAGE: Record<string, string> = {};

const storage = createJSONStorage(() => {
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return {
    getItem: (key: string) => FALLBACK_STORAGE[key] ?? null,
    setItem: (key: string, value: string) => {
      FALLBACK_STORAGE[key] = value;
    },
    removeItem: (key: string) => {
      delete FALLBACK_STORAGE[key];
    }
  };
});

interface AppState {
  selectedTala: string;
  selectedJati: JatiType;
  bpm: number;
  selectedInstrument: string;
  sruthi: string;
  droneEnabled: boolean;
  metronomeGain: number;
  droneGain: number;
  currentTemplate: TalaTemplate;
  savedTemplates: TalaTemplate[];
  isPlaying: boolean;
  activeBeat: number;
  setField: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  addBlock: (type: AngaType) => void;
  removeBlock: (id: string) => void;
  setLaghuJati: (id: string, jati: LaghuJatiCount) => void;
  saveCurrentTemplate: () => void;
  setCurrentTemplate: (template: TalaTemplate) => void;
  togglePlay: () => void;
  tickBeat: (total: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedTala: defaultPlayerSettings.selectedTala,
      selectedJati: defaultPlayerSettings.selectedJati,
      bpm: defaultPlayerSettings.bpm,
      selectedInstrument: defaultSoundSettings.selectedInstrument,
      sruthi: defaultSoundSettings.sruthi,
      droneEnabled: defaultSoundSettings.droneEnabled,
      metronomeGain: defaultSoundSettings.metronomeGain,
      droneGain: defaultSoundSettings.droneGain,
      currentTemplate: defaultTemplate,
      savedTemplates: [defaultTemplate],
      isPlaying: false,
      activeBeat: 1,
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),
      addBlock: (angaType) =>
        set((state) => ({
          currentTemplate: {
            ...state.currentTemplate,
            blocks: [
              ...state.currentTemplate.blocks,
              {
                id: `b-${Date.now()}`,
                angaType,
                jatiCount: angaType === 'LAGHU' ? getLaghuBeatCount(state.selectedJati) : undefined
              }
            ]
          }
        })),
      removeBlock: (id) =>
        set((state) => ({
          currentTemplate: {
            ...state.currentTemplate,
            blocks: state.currentTemplate.blocks.filter((b) => b.id !== id)
          }
        })),
      setLaghuJati: (id, jati) =>
        set((state) => ({
          currentTemplate: {
            ...state.currentTemplate,
            blocks: state.currentTemplate.blocks.map((b) => (b.id === id ? { ...b, jatiCount: jati } : b))
          }
        })),
      saveCurrentTemplate: () =>
        set((state) => {
          const templateId = state.currentTemplate.id;
          const withoutCurrent = state.savedTemplates.filter((template) => template.id !== templateId);
          return {
            savedTemplates: [...withoutCurrent, state.currentTemplate]
          };
        }),
      setCurrentTemplate: (template) =>
        set(() => ({
          currentTemplate: template
        })),
      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
      tickBeat: (total) => set((s) => ({ activeBeat: ((s.activeBeat % total) || 0) + 1 }))
    }),
    {
      name: 'carnatic-metronome-app-state',
      storage,
      partialize: (state) => ({
        selectedTala: state.selectedTala,
        selectedJati: state.selectedJati,
        bpm: state.bpm,
        selectedInstrument: state.selectedInstrument,
        sruthi: state.sruthi,
        droneEnabled: state.droneEnabled,
        metronomeGain: state.metronomeGain,
        droneGain: state.droneGain,
        currentTemplate: state.currentTemplate,
        savedTemplates: state.savedTemplates
      })
    }
  )
);
