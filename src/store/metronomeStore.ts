import { create } from 'zustand';

import { buildBeatSequence, JATIS, JatiType, TALAS, TalaType } from '../tala-engine';

const INSTRUMENTS = ['Mridangam', 'Ghatam', 'Kanjira', 'Click'] as const;
export type InstrumentType = (typeof INSTRUMENTS)[number];

export interface MetronomeState {
  selectedTala: TalaType;
  selectedJati: JatiType;
  selectedInstrument: InstrumentType;
  bpm: number;
  isPlaying: boolean;
  currentBeatIndex: number;
  timerRef: ReturnType<typeof setInterval> | null;
  setTala: (tala: TalaType) => void;
  setJati: (jati: JatiType) => void;
  setInstrument: (instrument: InstrumentType) => void;
  setBpm: (bpm: number) => void;
  startMockPlayback: () => void;
  stopMockPlayback: () => void;
}

const DEFAULT_TALA: TalaType = TALAS[5];
const DEFAULT_JATI: JatiType = JATIS[1];

export const useMetronomeStore = create<MetronomeState>((set, get) => ({
  selectedTala: DEFAULT_TALA,
  selectedJati: DEFAULT_JATI,
  selectedInstrument: 'Mridangam',
  bpm: 80,
  isPlaying: false,
  currentBeatIndex: 0,
  timerRef: null,

  setTala: (selectedTala) => set({ selectedTala, currentBeatIndex: 0 }),
  setJati: (selectedJati) => set({ selectedJati, currentBeatIndex: 0 }),
  setInstrument: (selectedInstrument) => set({ selectedInstrument }),
  setBpm: (bpm) => set({ bpm: Math.max(30, Math.min(240, Math.round(bpm))) }),

  startMockPlayback: () => {
    const state = get();
    if (state.isPlaying) return;

    const sequence = buildBeatSequence(state.selectedTala, state.selectedJati);
    const intervalMs = Math.round(60_000 / state.bpm);

    const timerRef = setInterval(() => {
      const current = get();
      const nextIndex = (current.currentBeatIndex + 1) % sequence.totalBeats;
      set({ currentBeatIndex: nextIndex });
    }, intervalMs);

    set({ isPlaying: true, timerRef });
  },

  stopMockPlayback: () => {
    const state = get();
    if (state.timerRef) {
      clearInterval(state.timerRef);
    }
    set({ isPlaying: false, timerRef: null, currentBeatIndex: 0 });
  }
}));

export const listInstruments = (): readonly InstrumentType[] => INSTRUMENTS;
