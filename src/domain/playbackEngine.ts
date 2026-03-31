import { getBeatIntervalMs } from './tala';

export interface PlaybackEngineConfig {
  bpm: number;
  totalAksharas: number;
  onTick: () => void;
}

export class MockPlaybackEngine {
  private bpm: number;
  private totalAksharas: number;
  private onTick: () => void;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(config: PlaybackEngineConfig) {
    this.bpm = config.bpm;
    this.totalAksharas = Math.max(1, config.totalAksharas);
    this.onTick = config.onTick;
  }

  getIntervalMs(): number {
    return getBeatIntervalMs(this.bpm);
  }

  isRunning(): boolean {
    return this.timer !== null;
  }

  start(): void {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.onTick();
    }, this.getIntervalMs());
  }

  pause(): void {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
  }

  stop(): void {
    this.pause();
  }

  updateBpm(nextBpm: number): void {
    this.bpm = Math.max(1, Math.round(nextBpm));

    if (this.timer) {
      this.pause();
      this.start();
    }
  }

  updateTotalAksharas(totalAksharas: number): void {
    this.totalAksharas = Math.max(1, Math.round(totalAksharas));
  }

  destroy(): void {
    this.pause();
  }
}

export const getNextBeat = (activeBeat: number, totalAksharas: number): number => {
  return (Math.max(1, activeBeat) % Math.max(1, totalAksharas)) + 1;
};
