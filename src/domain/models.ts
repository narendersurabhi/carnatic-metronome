export type AngaType = 'LAGHU' | 'DHRUTAM' | 'ANUDHRUTAM';
export type JatiType = 'TISRA' | 'CHATURASRA' | 'KHANDA' | 'MISRA' | 'SANKEERNA';

export interface Tala {
  id: string;
  name: string;
  aksharas: number;
  angaSymbols: string[];
  angaCount: number;
}

export interface Jati {
  id: JatiType;
  name: string;
  count: number;
  description: string;
}

export interface Anga {
  type: AngaType;
  beats: number;
  symbol: string;
}

export interface Beat {
  index: number;
  accent: 'STRONG' | 'MEDIUM' | 'WEAK';
}

export interface TemplateBlock {
  id: string;
  angaType: AngaType;
  jatiCount?: 3 | 4 | 5 | 7 | 9;
}

export interface TalaTemplate {
  id: string;
  name: string;
  blocks: TemplateBlock[];
}

export interface PlayerSettings {
  selectedTala: string;
  selectedJati: JatiType;
  bpm: number;
}

export interface SoundSettings {
  selectedInstrument: string;
  sruthi: string;
  droneEnabled: boolean;
  metronomeGain: number;
  droneGain: number;
}
