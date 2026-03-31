import { create } from 'zustand';

import { AngaType, JatiType, LaghuJatiCount, TalaTemplate } from '../domain/models';
import { defaultTemplate } from './mockData';

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
  togglePlay: () => void;
  tickBeat: (total: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedTala: 'triputa-aadi',
  selectedJati: 'CHATURASRA',
  bpm: 84,
  selectedInstrument: 'Mridangam',
  sruthi: 'C#',
  droneEnabled: true,
  metronomeGain: 82,
  droneGain: 45,
  currentTemplate: defaultTemplate,
  savedTemplates: [defaultTemplate],
  isPlaying: false,
  activeBeat: 1,
  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
  addBlock: (angaType) =>
    set((state) => ({
      currentTemplate: {
        ...state.currentTemplate,
        blocks: [...state.currentTemplate.blocks, { id: `b-${Date.now()}`, angaType, jatiCount: angaType === 'LAGHU' ? 4 : undefined }]
      }
    })),
  removeBlock: (id) =>
    set((state) => ({
      currentTemplate: { ...state.currentTemplate, blocks: state.currentTemplate.blocks.filter((b) => b.id !== id) }
    })),
  setLaghuJati: (id, jati) =>
    set((state) => ({
      currentTemplate: {
        ...state.currentTemplate,
        blocks: state.currentTemplate.blocks.map((b) => (b.id === id ? { ...b, jatiCount: jati } : b))
      }
    })),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  tickBeat: (total) => set((s) => ({ activeBeat: ((s.activeBeat % total) || 0) + 1 }))
}));
