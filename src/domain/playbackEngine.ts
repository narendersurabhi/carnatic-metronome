import { deriveActiveBeatDisplayNumber, getBeatIntervalMs } from './tala';
import { AudioService, BeatSampleType, DebugClickAudioService } from '../services/audio/AudioService';

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export interface PlaybackEngineConfig {
  bpm: number;
  totalAksharas: number;
  onBeat: (activeBeatDisplayNumber: number) => void;
  onStateChange?: (state: PlaybackState) => void;
  audioService?: AudioService;
  lookAheadMs?: number;
  schedulerIntervalMs?: number;
}

export interface ScheduledBeat {
  beatIndex: number;
  sampleType: BeatSampleType;
  atTimeMs: number;
}

export class SamplePlaybackEngine {
  private bpm: number;
  private totalAksharas: number;
  private readonly onBeat: (activeBeatDisplayNumber: number) => void;
  private readonly onStateChange?: (state: PlaybackState) => void;
  private readonly audioService: AudioService;
  private readonly lookAheadMs: number;
  private readonly schedulerIntervalMs: number;

  private state: PlaybackState = 'stopped';
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private uiTimers = new Set<ReturnType<typeof setTimeout>>();
  private nextBeatAtMs = 0;
  private nextBeatIndex = 0;

  constructor(config: PlaybackEngineConfig) {
    this.bpm = Math.max(1, Math.round(config.bpm));
    this.totalAksharas = Math.max(1, Math.round(config.totalAksharas));
    this.onBeat = config.onBeat;
    this.onStateChange = config.onStateChange;
    this.audioService = config.audioService ?? new DebugClickAudioService();
    this.lookAheadMs = config.lookAheadMs ?? 120;
    this.schedulerIntervalMs = config.schedulerIntervalMs ?? 25;
  }

  getState(): PlaybackState {
    return this.state;
  }

  getIntervalMs(): number {
    return getBeatIntervalMs(this.bpm);
  }

  async start(): Promise<void> {
    if (this.state === 'playing') {
      return;
    }

    await this.audioService.preloadSamples();
    await this.audioService.setTempo(this.bpm);

    if (this.state === 'stopped') {
      this.nextBeatIndex = 0;
      this.nextBeatAtMs = Date.now();
    }

    this.updateState('playing');
    this.schedulerTimer = setInterval(() => {
      void this.scheduleWindow();
    }, this.schedulerIntervalMs);

    await this.scheduleWindow();
  }

  async pause(): Promise<void> {
    if (this.state !== 'playing') {
      return;
    }

    this.stopSchedulerLoop();
    await this.audioService.pause();
    this.updateState('paused');
  }

  async stop(): Promise<void> {
    if (this.state === 'stopped') {
      return;
    }

    this.stopSchedulerLoop();
    this.nextBeatIndex = 0;
    this.nextBeatAtMs = 0;
    await this.audioService.stop();
    this.onBeat(1);
    this.updateState('stopped');
  }

  async seekToBeat(displayBeat: number): Promise<void> {
    const normalized = deriveActiveBeatDisplayNumber(displayBeat, this.totalAksharas);
    this.nextBeatIndex = normalized - 1;
    this.nextBeatAtMs = Date.now();
    await this.audioService.seekToBeat?.(normalized - 1);
    this.onBeat(normalized);
  }

  async updateBpm(nextBpm: number): Promise<void> {
    this.bpm = Math.max(1, Math.round(nextBpm));
    await this.audioService.setTempo(this.bpm);
  }

  updateTotalAksharas(totalAksharas: number): void {
    this.totalAksharas = Math.max(1, Math.round(totalAksharas));
    this.nextBeatIndex = this.nextBeatIndex % this.totalAksharas;
  }

  async setInstrument(instrumentId: string): Promise<void> {
    await this.audioService.setInstrument(instrumentId);
  }

  async dispose(): Promise<void> {
    this.stopSchedulerLoop();
    await this.audioService.dispose();
    this.updateState('stopped');
  }

  async scheduleWindow(nowMs = Date.now()): Promise<ScheduledBeat[]> {
    if (this.state !== 'playing') {
      return [];
    }

    if (this.nextBeatAtMs <= 0) {
      this.nextBeatAtMs = nowMs;
    }

    const horizonMs = nowMs + this.lookAheadMs;
    const intervalMs = this.getIntervalMs();
    const scheduled: ScheduledBeat[] = [];

    while (this.nextBeatAtMs <= horizonMs) {
      const beatIndex = this.nextBeatIndex % this.totalAksharas;
      const displayBeat = beatIndex + 1;
      const sampleType: BeatSampleType = beatIndex === 0 ? 'STRONG' : 'WEAK';
      const event: ScheduledBeat = {
        beatIndex,
        sampleType,
        atTimeMs: this.nextBeatAtMs
      };

      await this.audioService.play({ sampleType, whenMs: this.nextBeatAtMs, beatIndex });
      this.enqueueBeatUiUpdate(displayBeat, this.nextBeatAtMs);

      scheduled.push(event);
      this.nextBeatIndex = (this.nextBeatIndex + 1) % this.totalAksharas;
      this.nextBeatAtMs += intervalMs;
    }

    return scheduled;
  }

  private enqueueBeatUiUpdate(displayBeat: number, atTimeMs: number): void {
    const delay = Math.max(0, atTimeMs - Date.now());
    const timeout = setTimeout(() => {
      this.uiTimers.delete(timeout);
      if (this.state === 'playing') {
        this.onBeat(displayBeat);
      }
    }, delay);

    this.uiTimers.add(timeout);
  }

  private stopSchedulerLoop(): void {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    this.uiTimers.forEach((timer) => clearTimeout(timer));
    this.uiTimers.clear();
  }

  private updateState(nextState: PlaybackState): void {
    this.state = nextState;
    this.onStateChange?.(nextState);
  }
}

export const getNextBeat = (activeBeat: number, totalAksharas: number): number => {
  return (Math.max(1, activeBeat) % Math.max(1, totalAksharas)) + 1;
};
