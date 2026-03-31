import { BeatPattern, SampleType } from './types';

export const accentToSampleType = (accent: 'STRONG' | 'MEDIUM' | 'WEAK'): SampleType => accent;

export const buildBeatPattern = (totalBeats: number, accents: readonly ('STRONG' | 'MEDIUM' | 'WEAK')[]): BeatPattern[] => {
  if (totalBeats <= 0) throw new Error('totalBeats must be positive');
  if (accents.length !== totalBeats) throw new Error('accents length must match totalBeats');

  return accents.map((accent, beatIndex) => ({
    beatIndex,
    sampleType: accentToSampleType(accent)
  }));
};

export const buildBeatPatternFromSequence = (
  beats: readonly { cycleBeatIndex: number; accent: 'STRONG' | 'MEDIUM' | 'WEAK' }[]
): BeatPattern[] => {
  if (beats.length === 0) throw new Error('beats must not be empty');

  return beats.map((beat) => ({
    beatIndex: beat.cycleBeatIndex,
    sampleType: accentToSampleType(beat.accent)
  }));
};
