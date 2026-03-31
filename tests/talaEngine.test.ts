import { describe, expect, it } from 'vitest';

import {
  buildBeatSequence,
  getAngaBeatCount,
  getTalaDefinition,
  listSupportedJatis,
  resolveAccent
} from '../src/tala-engine';

describe('tala engine / beat sequencer', () => {
  it('supports all required jatis', () => {
    expect(listSupportedJatis()).toEqual(['TISRA', 'CHATURASRA', 'KHANDA', 'MISRA', 'SANKEERNA']);
  });

  it('returns correct anga beat counts', () => {
    expect(getAngaBeatCount('LAGHU', 'TISRA')).toBe(3);
    expect(getAngaBeatCount('LAGHU', 'CHATURASRA')).toBe(4);
    expect(getAngaBeatCount('LAGHU', 'KHANDA')).toBe(5);
    expect(getAngaBeatCount('LAGHU', 'MISRA')).toBe(7);
    expect(getAngaBeatCount('LAGHU', 'SANKEERNA')).toBe(9);
    expect(getAngaBeatCount('DRUTAM', 'TISRA')).toBe(2);
    expect(getAngaBeatCount('ANUDRUTAM', 'MISRA')).toBe(1);
  });

  it('builds expected beat totals for classical talas', () => {
    expect(buildBeatSequence('AADI', 'CHATURASRA').totalBeats).toBe(8);
    expect(buildBeatSequence('RUPAKA', 'CHATURASRA').totalBeats).toBe(6);
    expect(buildBeatSequence('EKA', 'TISRA').totalBeats).toBe(3);
    expect(buildBeatSequence('JHAMPA', 'MISRA').totalBeats).toBe(10);
  });

  it('adds deterministic beat metadata for visualization and scheduling', () => {
    const sequence = buildBeatSequence('ATA', 'KHANDA');
    expect(sequence.totalBeats).toBe(14);
    expect(sequence.beats[0]).toMatchObject({ cycleBeatIndex: 0, angaIndex: 0, angaBeatIndex: 0, isSamam: true });
    expect(sequence.beats[5]).toMatchObject({ angaIndex: 1, angaBeatIndex: 0 });
    expect(sequence.beats.at(-1)).toMatchObject({ cycleBeatIndex: 13, angaType: 'DRUTAM', angaBeatIndex: 1 });
  });

  it('applies accent logic correctly', () => {
    expect(resolveAccent({ cycleBeatIndex: 0, angaBeatIndex: 0, angaType: 'LAGHU' })).toBe('STRONG');
    expect(resolveAccent({ cycleBeatIndex: 4, angaBeatIndex: 0, angaType: 'LAGHU' })).toBe('MEDIUM');
    expect(resolveAccent({ cycleBeatIndex: 5, angaBeatIndex: 1, angaType: 'DRUTAM' })).toBe('MEDIUM');
    expect(resolveAccent({ cycleBeatIndex: 2, angaBeatIndex: 2, angaType: 'LAGHU' })).toBe('WEAK');
  });

  it('contains all requested talas', () => {
    const talas = ['DHRUVA', 'MATYA', 'JHAMPA', 'ATA', 'EKA', 'AADI', 'RUPAKA'] as const;
    talas.forEach((tala) => {
      expect(getTalaDefinition(tala).tala).toBe(tala);
    });
  });
});
