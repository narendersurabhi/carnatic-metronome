export type AngaType = 'LAGHU' | 'DHRUTAM' | 'ANUDHRUTAM';
export type JatiType = 'TISRA' | 'CHATURASRA' | 'KHANDA' | 'MISRA' | 'SANKEERNA';

export type LaghuJatiCount = 3 | 4 | 5 | 7 | 9;

export interface Jati {
  id: JatiType;
  name: string;
  count: LaghuJatiCount;
  description: string;
}

export interface Anga {
  type: AngaType;
  beatCount: number;
  label: string;
}

export interface Beat {
  index: number;
  angaIndex: number;
  isSamam: boolean;
}

export interface DerivedBeat {
  index: number;
  displayNumber: number;
  angaIndex: number;
  angaType: AngaType;
  angaBeatIndex: number;
  angaLabel: string;
  isSamam: boolean;
}

export interface AngaBoundary {
  angaIndex: number;
  angaType: AngaType;
  label: string;
  startBeat: number;
  endBeat: number;
  beatCount: number;
}

export interface TalaCycleSummary {
  source: 'template' | 'sapta-tala';
  talaId: string;
  talaName: string;
  jati: JatiType;
  totalAksharas: number;
  activeBeatDisplayNumber: number;
}

export interface DerivedTalaCycle {
  source: 'template' | 'sapta-tala';
  beats: DerivedBeat[];
  totalAksharas: number;
  angaBoundaries: AngaBoundary[];
}

export interface TemplateBlock {
  id: string;
  angaType: AngaType;
  jatiCount?: LaghuJatiCount;
}

export interface TalaTemplate {
  id: string;
  name: string;
  blocks: TemplateBlock[];
}

export interface TalaDefinition {
  id: string;
  name: string;
  angaPattern: readonly AngaType[];
}

export interface SaptaTala {
  id: string;
  name: string;
  angaPattern: readonly AngaType[];
  angaLabels: string[];
  aksharas: number;
}

export interface PlayerSettings {
  selectedTala: string;
  selectedJati: JatiType;
  bpm: number;
  selectedTemplateId: string;
}

export interface SoundSettings {
  selectedInstrument: string;
  sruthi: string;
  droneEnabled: boolean;
  metronomeGain: number;
  droneGain: number;
}

export interface PlayerSummaryState {
  talaName: string;
  jatiName: string;
  bpm: number;
  instrument: string;
  sruthi: string;
  templateName: string;
  totalAksharas: number;
}
