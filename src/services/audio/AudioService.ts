export interface AudioService {
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  setTempo(bpm: number): Promise<void>;
  setInstrument(instrumentId: string): Promise<void>;
  preloadSamples(): Promise<void>;
}

export class MockAudioService implements AudioService {
  // TODO(M2): Replace with real low-latency scheduler + sample playback implementation.
  async play(): Promise<void> {}

  // TODO(M2): Keep transport position and scheduler state in sync with tala-engine timing.
  async pause(): Promise<void> {}

  async stop(): Promise<void> {}

  async setTempo(_bpm: number): Promise<void> {}

  async setInstrument(_instrumentId: string): Promise<void> {}

  // TODO(M2): Preload and cache selected instrument + drone assets.
  async preloadSamples(): Promise<void> {}
}
