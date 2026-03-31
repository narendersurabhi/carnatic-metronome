import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SamplePlaybackEngine, getNextBeat } from '../src/domain/playbackEngine';
import { deriveCycleFromSaptaTala, deriveCycleFromTemplate, getBeatIntervalMs } from '../src/domain/tala';
import { AudioService, PlayBeatRequest } from '../src/services/audio/AudioService';

class CaptureAudioService implements AudioService {
  public readonly events: PlayBeatRequest[] = [];
  public preloadCount = 0;
  public pauseCount = 0;

  async preloadSamples(): Promise<void> {
    this.preloadCount += 1;
  }

  async play(request: PlayBeatRequest): Promise<void> {
    this.events.push(request);
  }

  async pause(): Promise<void> {
    this.pauseCount += 1;
  }
  async stop(): Promise<void> {}
  async setTempo(_bpm: number): Promise<void> {}
  async setInstrument(_instrumentId: string): Promise<void> {}
  async seekToBeat(_beatIndex: number): Promise<void> {}
  async dispose(): Promise<void> {}
}

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

describe('sample playback timing engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-31T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('computes beat interval from bpm', () => {
    expect(getBeatIntervalMs(120)).toBe(500);
    expect(getBeatIntervalMs(84)).toBe(714);
  });

  it('advances and loops beats deterministically', async () => {
    expect(getNextBeat(1, 8)).toBe(2);
    expect(getNextBeat(8, 8)).toBe(1);

    const service = new CaptureAudioService();
    const beats: number[] = [];
    const engine = new SamplePlaybackEngine({
      bpm: 120,
      totalAksharas: 2,
      audioService: service,
      onBeat: (beat) => beats.push(beat)
    });

    await engine.start();
    vi.advanceTimersByTime(1200);

    expect(service.events.length).toBeGreaterThanOrEqual(2);
    expect(beats).toContain(1);
    expect(beats).toContain(2);

    await engine.stop();
  });

  it('handles tempo changes during playback without losing loop order', async () => {
    const service = new CaptureAudioService();
    const engine = new SamplePlaybackEngine({
      bpm: 60,
      totalAksharas: 4,
      audioService: service,
      onBeat: () => {}
    });

    await engine.start();
    vi.advanceTimersByTime(1100);
    const eventsAt60 = service.events.length;

    await engine.updateBpm(120);
    vi.advanceTimersByTime(1100);

    expect(service.events.length).toBeGreaterThan(eventsAt60);
    await engine.stop();
  });

  it('prevents duplicate playback scheduling on rapid play/pause taps', async () => {
    const service = new CaptureAudioService();
    const engine = new SamplePlaybackEngine({
      bpm: 100,
      totalAksharas: 8,
      audioService: service,
      onBeat: () => {}
    });

    await engine.start();
    await engine.start();
    await engine.pause();
    await engine.start();
    vi.advanceTimersByTime(250);

    const eventsAfterRapidTaps = service.events.length;
    vi.advanceTimersByTime(250);
    expect(service.events.length - eventsAfterRapidTaps).toBeLessThanOrEqual(2);

    await engine.stop();
  });

  it('preloads samples once across pause and resume', async () => {
    const service = new CaptureAudioService();
    const engine = new SamplePlaybackEngine({
      bpm: 90,
      totalAksharas: 8,
      audioService: service,
      onBeat: () => {}
    });

    await engine.start();
    await engine.pause();
    await engine.start();

    expect(service.preloadCount).toBe(1);
    await engine.stop();
  });

  it('pauses when app backgrounds', async () => {
    const service = new CaptureAudioService();
    const engine = new SamplePlaybackEngine({
      bpm: 90,
      totalAksharas: 8,
      audioService: service,
      onBeat: () => {}
    });

    await engine.start();
    await engine.handleAppBackground();

    expect(engine.getState()).toBe('paused');
    expect(service.pauseCount).toBe(1);
  });
});
