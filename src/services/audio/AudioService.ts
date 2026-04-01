import { NativeModules } from 'react-native';

export type BeatSampleType = 'STRONG' | 'MEDIUM' | 'WEAK';

export interface PlayBeatRequest {
  sampleType: BeatSampleType;
  whenMs?: number;
  beatIndex?: number;
}

export interface AudioService {
  preloadSamples(): Promise<void>;
  play(request: PlayBeatRequest): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  setTempo(bpm: number): Promise<void>;
  setInstrument(instrumentId: string): Promise<void>;
  seekToBeat?(beatIndex: number): Promise<void>;
  dispose(): Promise<void>;
}

const MRIDANGAM_SAMPLE_LIBRARY: Record<string, Record<BeatSampleType, string>> = {
  mridangam: {
    STRONG: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_7f6eb7f830.mp3?filename=drum-hit-1-44370.mp3',
    MEDIUM: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b918096650.mp3?filename=drum-hit-2-44369.mp3',
    WEAK: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0f6171a2d5.mp3?filename=drum-hit-3-44371.mp3'
  }
};

const DEFAULT_INSTRUMENT = 'mridangam';

const hasExpoRuntimeAudioModules = (): boolean => {
  const nativeModules = NativeModules as Record<string, unknown>;
  const hasConstants = Boolean(nativeModules.ExponentConstants);
  const hasAssetModule = Boolean(nativeModules.ExpoAsset ?? nativeModules.ExponentAsset);
  return hasConstants && hasAssetModule;
};

export class ExpoSampleAudioService implements AudioService {
  private instrumentId = DEFAULT_INSTRUMENT;
  private bpm = 80;
  private sounds: Partial<Record<BeatSampleType, any>> = {};
  private expoAudio: any = null;
  private isLoaded = false;
  private hasNativeAudio = true;
  private scheduledPlayback = new Set<ReturnType<typeof setTimeout>>();

  async preloadSamples(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    if (!hasExpoRuntimeAudioModules()) {
      this.hasNativeAudio = false;
      this.isLoaded = true;
      return;
    }

    const expoAv = await import('expo-av').catch(() => null);
    if (!expoAv?.Audio?.Sound) {
      this.hasNativeAudio = false;
      this.isLoaded = true;
      return;
    }

    this.expoAudio = expoAv.Audio;
    await this.expoAudio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true
    });

    await this.loadInstrument(this.instrumentId);
    this.isLoaded = true;
  }

  async play(request: PlayBeatRequest): Promise<void> {
    if (!this.isLoaded) {
      await this.preloadSamples();
    }
    if (!this.hasNativeAudio) {
      return;
    }

    const trigger = async () => {
      const sound = this.sounds[request.sampleType] ?? this.sounds.WEAK;
      if (!sound) {
        return;
      }

      await sound.replayAsync();
    };

    const delayMs = Math.max(0, (request.whenMs ?? Date.now()) - Date.now());
    if (delayMs <= 8) {
      await trigger();
      return;
    }

    const timeout = setTimeout(() => {
      this.scheduledPlayback.delete(timeout);
      void trigger();
    }, delayMs);
    this.scheduledPlayback.add(timeout);
  }

  async pause(): Promise<void> {
    this.clearScheduledPlayback();
  }

  async stop(): Promise<void> {
    this.clearScheduledPlayback();
    if (!this.hasNativeAudio) {
      return;
    }
    await Promise.all(
      Object.values(this.sounds).map(async (sound) => {
        if (sound) {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
        }
      })
    );
  }

  async setTempo(bpm: number): Promise<void> {
    this.bpm = Math.max(1, Math.round(bpm));
  }

  async setInstrument(instrumentId: string): Promise<void> {
    const nextInstrument = MRIDANGAM_SAMPLE_LIBRARY[instrumentId] ? instrumentId : DEFAULT_INSTRUMENT;
    this.instrumentId = nextInstrument;

    if (!this.expoAudio || !this.hasNativeAudio) {
      return;
    }

    await this.unloadSamples();
    await this.loadInstrument(nextInstrument);
  }

  async seekToBeat(_beatIndex: number): Promise<void> {
    await this.stop();
  }

  async dispose(): Promise<void> {
    await this.stop();
    if (!this.hasNativeAudio) {
      this.isLoaded = false;
      return;
    }
    await this.unloadSamples();
    this.isLoaded = false;
  }

  private async loadInstrument(instrumentId: string): Promise<void> {
    const library = MRIDANGAM_SAMPLE_LIBRARY[instrumentId] ?? MRIDANGAM_SAMPLE_LIBRARY[DEFAULT_INSTRUMENT];
    const entries = await Promise.all(
      (Object.keys(library) as BeatSampleType[]).map(async (sampleType) => {
        const { sound } = await this.expoAudio.Sound.createAsync({ uri: library[sampleType] }, { shouldPlay: false, volume: 1 });
        return [sampleType, sound] as const;
      })
    );

    this.sounds = Object.fromEntries(entries);
  }

  private async unloadSamples(): Promise<void> {
    await Promise.all(
      Object.values(this.sounds).map(async (sound) => {
        if (sound) {
          await sound.unloadAsync();
        }
      })
    );
    this.sounds = {};
  }

  private clearScheduledPlayback(): void {
    this.scheduledPlayback.forEach((timeout) => clearTimeout(timeout));
    this.scheduledPlayback.clear();
  }
}

export class DebugClickAudioService implements AudioService {
  async preloadSamples(): Promise<void> {}
  async play(_request: PlayBeatRequest): Promise<void> {}
  async pause(): Promise<void> {}
  async stop(): Promise<void> {}
  async setTempo(_bpm: number): Promise<void> {}
  async setInstrument(_instrumentId: string): Promise<void> {}
  async seekToBeat(_beatIndex: number): Promise<void> {}
  async dispose(): Promise<void> {}
}
