export const TALAS = [
  'DHRUVA',
  'MATYA',
  'JHAMPA',
  'ATA',
  'EKA',
  'AADI',
  'RUPAKA'
] as const;

export const JATIS = ['TISRA', 'CHATURASRA', 'KHANDA', 'MISRA', 'SANKEERNA'] as const;

export type TalaType = (typeof TALAS)[number];
export type JatiType = (typeof JATIS)[number];
export type AngaType = 'LAGHU' | 'DRUTAM' | 'ANUDRUTAM';
export type AccentLevel = 'STRONG' | 'MEDIUM' | 'WEAK';

export interface TalaDefinition {
  tala: TalaType;
  label: string;
  angaPattern: readonly AngaType[];
}

export interface Beat {
  tala: TalaType;
  jati: JatiType;
  cycleBeatIndex: number;
  angaIndex: number;
  angaType: AngaType;
  angaBeatIndex: number;
  accent: AccentLevel;
  isSamam: boolean;
}

export interface BeatSequence {
  tala: TalaType;
  jati: JatiType;
  totalBeats: number;
  beats: Beat[];
}
