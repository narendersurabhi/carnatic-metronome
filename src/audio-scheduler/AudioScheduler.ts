import { AudioQueuePort, BeatPattern, Clock, SchedulerConfig, ScheduledBeat } from './types';

const DEFAULT_CONFIG: SchedulerConfig = {
  bpm: 80,
  lookAheadMs: 120,
  scheduleIntervalMs: 25
};

interface SchedulerDeps {
  clock: Clock;
  queue: AudioQueuePort;
}

export class AudioScheduler {
  private readonly clock: Clock;
  private readonly queue: AudioQueuePort;
  private config: SchedulerConfig;
  private pattern: BeatPattern[] = [];
  private timerRef: ReturnType<typeof setInterval> | null = null;
  private nextBeatAtMs = 0;
  private nextBeatPointer = 0;

  constructor(deps: SchedulerDeps, config?: Partial<SchedulerConfig>) {
    this.clock = deps.clock;
    this.queue = deps.queue;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setBpm(bpm: number): void {
    if (bpm <= 0) throw new Error('bpm must be > 0');
    this.config = { ...this.config, bpm };
  }

  setPattern(pattern: BeatPattern[]): void {
    if (pattern.length === 0) throw new Error('pattern must not be empty');
    this.pattern = pattern;
    this.nextBeatPointer = 0;
  }

  start(startAtMs?: number): void {
    if (this.pattern.length === 0) throw new Error('pattern is not set');
    if (this.timerRef) return;

    const now = this.clock.nowMs();
    this.nextBeatAtMs = startAtMs ?? now + this.config.scheduleIntervalMs;

    this.timerRef = setInterval(() => {
      this.scheduleWindow();
    }, this.config.scheduleIntervalMs);

    this.scheduleWindow();
  }

  stop(): void {
    if (!this.timerRef) return;
    clearInterval(this.timerRef);
    this.timerRef = null;
  }

  isRunning(): boolean {
    return this.timerRef !== null;
  }

  /**
   * Pre-schedules beats into look-ahead window. Intended to be consumed by a
   * native/expo audio adapter that triggers sample playback at `atTimeMs`.
   */
  scheduleWindow(): ScheduledBeat[] {
    if (this.pattern.length === 0) return [];

    const now = this.clock.nowMs();
    const horizon = now + this.config.lookAheadMs;
    const beatDurationMs = 60_000 / this.config.bpm;
    const scheduled: ScheduledBeat[] = [];

    while (this.nextBeatAtMs <= horizon) {
      const beat = this.pattern[this.nextBeatPointer % this.pattern.length];
      const item: ScheduledBeat = {
        beatIndex: beat.beatIndex,
        sampleType: beat.sampleType,
        atTimeMs: this.nextBeatAtMs
      };

      this.queue.enqueue(item);
      scheduled.push(item);

      this.nextBeatPointer += 1;
      this.nextBeatAtMs += beatDurationMs;
    }

    return scheduled;
  }
}
