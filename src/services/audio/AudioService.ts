export interface AudioService {
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  setTempo(bpm: number): Promise<void>;
  setInstrument(instrumentId: string): Promise<void>;
  preloadSamples(): Promise<void>;
}

export class MockAudioService implements AudioService {
  async play(): Promise<void> {}
  async pause(): Promise<void> {}
  async stop(): Promise<void> {}
  async setTempo(_bpm: number): Promise<void> {}
  async setInstrument(_instrumentId: string): Promise<void> {}
  async preloadSamples(): Promise<void> {}
}
