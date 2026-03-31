import { describe, expect, it } from 'vitest';

import { AudioScheduler, buildBeatPattern, buildBeatPatternFromSequence, Clock, ScheduledBeat } from '../src/audio-scheduler';

class FakeClock implements Clock {
  private current = 0;

  nowMs(): number {
    return this.current;
  }

  set(timeMs: number): void {
    this.current = timeMs;
  }

  advance(deltaMs: number): void {
    this.current += deltaMs;
  }
}

class CaptureQueue {
  public events: ScheduledBeat[] = [];

  enqueue(beat: ScheduledBeat): void {
    this.events.push(beat);
  }
}

describe('audio scheduler', () => {
  it('builds beat pattern from accent map', () => {
    const pattern = buildBeatPattern(4, ['STRONG', 'WEAK', 'MEDIUM', 'WEAK']);
    expect(pattern).toEqual([
      { beatIndex: 0, sampleType: 'STRONG' },
      { beatIndex: 1, sampleType: 'WEAK' },
      { beatIndex: 2, sampleType: 'MEDIUM' },
      { beatIndex: 3, sampleType: 'WEAK' }
    ]);
  });

  it('maps tala sequence beats to sample pattern', () => {
    const pattern = buildBeatPatternFromSequence([
      { cycleBeatIndex: 0, accent: 'STRONG' },
      { cycleBeatIndex: 1, accent: 'WEAK' },
      { cycleBeatIndex: 2, accent: 'MEDIUM' }
    ]);

    expect(pattern).toEqual([
      { beatIndex: 0, sampleType: 'STRONG' },
      { beatIndex: 1, sampleType: 'WEAK' },
      { beatIndex: 2, sampleType: 'MEDIUM' }
    ]);
  });

  it('pre-schedules beats into look-ahead window with precise intervals', () => {
    const clock = new FakeClock();
    const queue = new CaptureQueue();
    const scheduler = new AudioScheduler(
      { clock, queue },
      { bpm: 120, lookAheadMs: 150, scheduleIntervalMs: 20 }
    );

    const pattern = buildBeatPattern(2, ['STRONG', 'WEAK']);
    scheduler.setPattern(pattern);

    clock.set(1000);
    scheduler.start(1000);

    const firstBatch = scheduler.scheduleWindow();
    expect(firstBatch.length).toBeGreaterThan(0);
    expect(firstBatch[0].atTimeMs).toBe(1000);

    clock.advance(500);
    const secondBatch = scheduler.scheduleWindow();
    expect(secondBatch[0].atTimeMs % 500).toBe(0);

    scheduler.stop();
  });

  it('cycles pattern indices while scheduling', () => {
    const clock = new FakeClock();
    const queue = new CaptureQueue();
    const scheduler = new AudioScheduler(
      { clock, queue },
      { bpm: 60, lookAheadMs: 2200, scheduleIntervalMs: 25 }
    );

    scheduler.setPattern(buildBeatPattern(3, ['STRONG', 'MEDIUM', 'WEAK']));
    clock.set(0);
    const batch = scheduler.scheduleWindow();

    expect(batch.slice(0, 4).map((b) => b.beatIndex)).toEqual([0, 1, 2, 0]);
    expect(batch.slice(0, 3).map((b) => b.sampleType)).toEqual(['STRONG', 'MEDIUM', 'WEAK']);
  });
});
