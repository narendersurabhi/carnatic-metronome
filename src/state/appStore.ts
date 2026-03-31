import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AngaType, JatiType, LaghuJatiCount, TalaTemplate, TemplateBlock } from '../domain/models';
import { getLaghuBeatCount } from '../domain/tala';
import { defaultPlayerSettings, defaultSoundSettings, defaultTemplate } from './mockData';

const FALLBACK_STORAGE: Record<string, string> = {};
const STORE_VERSION = 2;

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

const JATI_VALUES: JatiType[] = ['TISRA', 'CHATURASRA', 'KHANDA', 'MISRA', 'SANKEERNA'];
const ANGA_VALUES: AngaType[] = ['LAGHU', 'DHRUTAM', 'ANUDHRUTAM'];

const asFiniteNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
};

const sanitizeTemplateBlock = (value: unknown, fallbackId: string): TemplateBlock | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<TemplateBlock>;
  if (!raw.angaType || !ANGA_VALUES.includes(raw.angaType)) {
    return null;
  }

  return {
    id: typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : fallbackId,
    angaType: raw.angaType,
    jatiCount: raw.angaType === 'LAGHU' && typeof raw.jatiCount === 'number' ? (raw.jatiCount as LaghuJatiCount) : undefined
  };
};

const sanitizeTemplate = (value: unknown, fallback: TalaTemplate): TalaTemplate => {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const raw = value as Partial<TalaTemplate>;
  const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const blocks = rawBlocks
    .map((block, index) => sanitizeTemplateBlock(block, `b-${Date.now()}-${index}`))
    .filter((block): block is TemplateBlock => Boolean(block));

  return {
    id: typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : fallback.id,
    name: typeof raw.name === 'string' && raw.name.trim().length > 0 ? raw.name.trim() : fallback.name,
    blocks: blocks.length > 0 ? blocks : fallback.blocks
  };
};

const sanitizePersistedState = (persisted: Partial<AppState>): Partial<AppState> => {
  const selectedJati = JATI_VALUES.includes(persisted.selectedJati as JatiType)
    ? (persisted.selectedJati as JatiType)
    : defaultPlayerSettings.selectedJati;

  const currentTemplate = sanitizeTemplate(persisted.currentTemplate, defaultTemplate);
  const savedTemplatesRaw = Array.isArray(persisted.savedTemplates)
    ? persisted.savedTemplates.map((t, index) => sanitizeTemplate(t, { ...defaultTemplate, id: `tmpl-${index + 1}` }))
    : [defaultTemplate];
  const savedTemplates = savedTemplatesRaw.length > 0 ? savedTemplatesRaw : [defaultTemplate];

  return {
    selectedTala:
      typeof persisted.selectedTala === 'string' && persisted.selectedTala.trim().length > 0
        ? persisted.selectedTala
        : defaultPlayerSettings.selectedTala,
    selectedJati,
    bpm: Math.max(20, Math.min(300, Math.round(asFiniteNumber(persisted.bpm, defaultPlayerSettings.bpm)))),
    selectedInstrument:
      typeof persisted.selectedInstrument === 'string' && persisted.selectedInstrument.trim().length > 0
        ? persisted.selectedInstrument
        : defaultSoundSettings.selectedInstrument,
    sruthi: typeof persisted.sruthi === 'string' && persisted.sruthi.trim().length > 0 ? persisted.sruthi : defaultSoundSettings.sruthi,
    droneEnabled: typeof persisted.droneEnabled === 'boolean' ? persisted.droneEnabled : defaultSoundSettings.droneEnabled,
    metronomeGain: Math.max(0, Math.min(100, Math.round(asFiniteNumber(persisted.metronomeGain, defaultSoundSettings.metronomeGain)))),
    droneGain: Math.max(0, Math.min(100, Math.round(asFiniteNumber(persisted.droneGain, defaultSoundSettings.droneGain)))),
    currentTemplate,
    savedTemplates,
    selectedTemplateId:
      typeof persisted.selectedTemplateId === 'string' && persisted.selectedTemplateId.trim().length > 0
        ? persisted.selectedTemplateId
        : currentTemplate.id
  };
};

interface AppState {
  selectedTala: string;
  selectedJati: JatiType;
  bpm: number;
  selectedInstrument: string;
  sruthi: string;
  droneEnabled: boolean;
  metronomeGain: number;
  droneGain: number;
  selectedTemplateId: string;
  currentTemplate: TalaTemplate;
  savedTemplates: TalaTemplate[];
  playbackState: 'stopped' | 'playing' | 'paused';
  activeBeat: number;
  setField: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  addBlock: (type: AngaType) => void;
  removeBlock: (id: string) => void;
  setLaghuJati: (id: string, jati: LaghuJatiCount) => void;
  saveCurrentTemplate: () => void;
  deleteTemplate: (templateId: string) => void;
  loadTemplate: (templateId: string) => void;
  setCurrentTemplate: (template: TalaTemplate) => void;
  startPlayback: () => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  advanceBeat: (total: number) => void;
  resetActiveBeat: () => void;
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
      selectedTemplateId: defaultTemplate.id,
      currentTemplate: defaultTemplate,
      savedTemplates: [defaultTemplate],
      playbackState: 'stopped',
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
          const template = sanitizeTemplate(state.currentTemplate, defaultTemplate);
          const withoutCurrent = state.savedTemplates.filter((savedTemplate) => savedTemplate.id !== template.id);
          return {
            currentTemplate: template,
            selectedTemplateId: template.id,
            savedTemplates: [...withoutCurrent, template]
          };
        }),
      deleteTemplate: (templateId) =>
        set((state) => {
          if (state.savedTemplates.length <= 1) {
            return state;
          }

          const filtered = state.savedTemplates.filter((template) => template.id !== templateId);
          const nextCurrent =
            state.currentTemplate.id === templateId ? filtered[filtered.length - 1] ?? defaultTemplate : state.currentTemplate;

          return {
            savedTemplates: filtered,
            currentTemplate: nextCurrent,
            selectedTemplateId: nextCurrent.id
          };
        }),
      loadTemplate: (templateId) =>
        set((state) => {
          const match = state.savedTemplates.find((template) => template.id === templateId);
          if (!match) {
            return state;
          }

          return {
            currentTemplate: match,
            selectedTemplateId: match.id,
            activeBeat: 1
          };
        }),
      setCurrentTemplate: (template) =>
        set(() => ({
          selectedTemplateId: template.id,
          currentTemplate: sanitizeTemplate(template, defaultTemplate)
        })),
      startPlayback: () => set(() => ({ playbackState: 'playing' })),
      pausePlayback: () => set(() => ({ playbackState: 'paused' })),
      stopPlayback: () => set(() => ({ playbackState: 'stopped', activeBeat: 1 })),
      advanceBeat: (total) => set((s) => ({ activeBeat: (s.activeBeat % Math.max(1, total)) + 1 })),
      resetActiveBeat: () => set(() => ({ activeBeat: 1 }))
    }),
    {
      name: 'carnatic-metronome-app-state',
      storage,
      version: STORE_VERSION,
      migrate: (persistedState) => sanitizePersistedState((persistedState ?? {}) as Partial<AppState>),
      merge: (persistedState, currentState) => {
        const safePersisted = sanitizePersistedState((persistedState ?? {}) as Partial<AppState>);
        return {
          ...currentState,
          ...safePersisted,
          playbackState: 'stopped',
          activeBeat: 1
        } as AppState;
      },
      partialize: (state) => ({
        selectedTala: state.selectedTala,
        selectedJati: state.selectedJati,
        bpm: state.bpm,
        selectedInstrument: state.selectedInstrument,
        sruthi: state.sruthi,
        droneEnabled: state.droneEnabled,
        metronomeGain: state.metronomeGain,
        droneGain: state.droneGain,
        selectedTemplateId: state.selectedTemplateId,
        currentTemplate: state.currentTemplate,
        savedTemplates: state.savedTemplates
      })
    }
  )
);
