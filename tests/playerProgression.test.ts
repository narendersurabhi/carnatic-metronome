import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MockPlaybackEngine, getNextBeat } from '../src/domain/playbackEngine';
import { deriveCycleFromSaptaTala, deriveCycleFromTemplate, getBeatIntervalMs } from '../src/domain/tala';

describe('player progression tala derivation', () => {
  it('derives sapta tala sequences with deterministic totals', () => {
    expect(deriveCycleFromSaptaTala('triputa-aadi', 'CHATURASRA').totalAksharas).toBe(8);
    expect(deriveCycleFromSaptaTala('jhampa', 'MISRA').totalAksharas).toBe(10);
  });

  it('applies jati impact to laghu counts', () => {
    const ekaTisra = deriveCycleFromSaptaTala('eka', 'TISRA');
    const ekaSankeerna = deriveCycleFromSaptaTala('eka', 'SANKEERNA');

    expect(ekaTisra.totalAksharas).toBe(3);
    expect(ekaSankeerna.totalAksharas).toBe(9);
  });

  it('derives custom template totals and boundaries', () => {
    const templateCycle = deriveCycleFromTemplate(
      {
        id: 'custom',
        name: 'Custom',
        blocks: [
          { id: 'l1', angaType: 'LAGHU', jatiCount: 5 },
          { id: 'd1', angaType: 'DHRUTAM' },
          { id: 'a1', angaType: 'ANUDHRUTAM' }
        ]
      },
      'CHATURASRA'
    );

    expect(templateCycle.totalAksharas).toBe(8);
    expect(templateCycle.angaBoundaries).toEqual([
      expect.objectContaining({ label: 'I₅', startBeat: 1, endBeat: 5 }),
      expect.objectContaining({ label: 'O', startBeat: 6, endBeat: 7 }),
      expect.objectContaining({ label: 'U', startBeat: 8, endBeat: 8 })
    ]);
  });
});

describe('mock playback timing engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('computes beat interval from bpm', () => {
    expect(getBeatIntervalMs(120)).toBe(500);
    expect(getBeatIntervalMs(84)).toBe(714);
  });

  it('advances and loops beats deterministically', () => {
    expect(getNextBeat(1, 8)).toBe(2);
    expect(getNextBeat(8, 8)).toBe(1);
  });

  it('responds to bpm changes while running', () => {
    let ticks = 0;
    const engine = new MockPlaybackEngine({
      bpm: 60,
      totalAksharas: 8,
      onTick: () => {
        ticks += 1;
      }
    });

    engine.start();
    vi.advanceTimersByTime(1000);
    expect(ticks).toBe(1);

    engine.updateBpm(120);
    vi.advanceTimersByTime(1000);
    expect(ticks).toBe(3);

    engine.stop();
    vi.advanceTimersByTime(1000);
    expect(ticks).toBe(3);
  });
});
