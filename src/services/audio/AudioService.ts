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

type WebAudioLike = {
  currentTime: number;
  preload: string;
  play: () => Promise<void>;
  pause: () => void;
};

type WebAudioContextLike = {
  currentTime: number;
  state: string;
  resume: () => Promise<void>;
  createGain: () => {
    connect: (destination: unknown) => void;
    gain: {
      value: number;
      setValueAtTime: (value: number, time: number) => void;
      exponentialRampToValueAtTime: (value: number, time: number) => void;
    };
  };
  createOscillator: () => {
    type: string;
    frequency: { value: number };
    connect: (destination: unknown) => void;
    start: (when?: number) => void;
    stop: (when?: number) => void;
  };
  destination: unknown;
};

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

const supportsWebAudioElement = (): boolean =>
  typeof globalThis !== 'undefined' && typeof (globalThis as { Audio?: unknown }).Audio === 'function';

const supportsWebAudioContext = (): boolean => {
  if (typeof globalThis === 'undefined') {
    return false;
  }

  const maybeAudioContext = globalThis as {
    AudioContext?: new () => WebAudioContextLike;
    webkitAudioContext?: new () => WebAudioContextLike;
  };
  return typeof maybeAudioContext.AudioContext === 'function' || typeof maybeAudioContext.webkitAudioContext === 'function';
};

export class ExpoSampleAudioService implements AudioService {
  private instrumentId = DEFAULT_INSTRUMENT;
  private bpm = 80;
  private sounds: Partial<Record<BeatSampleType, any>> = {};
  private expoAudio: any = null;
  private isLoaded = false;
  private hasNativeAudio = true;
  private hasWebAudio = false;
  private hasWebOscillator = false;
  private scheduledPlayback = new Set<ReturnType<typeof setTimeout>>();
  private webAudioElements: Partial<Record<BeatSampleType, WebAudioLike>> = {};
  private webAudioContext: WebAudioContextLike | null = null;

  async preloadSamples(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    if (!hasExpoRuntimeAudioModules()) {
      await this.initializeWebFallbacks();
      if (!this.hasWebAudio && !this.hasWebOscillator) {
        this.hasNativeAudio = false;
        this.isLoaded = true;
        return;
      }
    }

    const expoAvModule = await import('expo-av').catch(() => null);
    if (!expoAvModule?.Audio?.Sound) {
      await this.initializeWebFallbacks();
      if (!this.hasWebAudio && !this.hasWebOscillator) {
        this.hasNativeAudio = false;
        this.isLoaded = true;
        return;
      }
      this.hasNativeAudio = false;
      this.isLoaded = true;
      return;
    }

    this.expoAudio = expoAvModule.Audio;
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
    if (!this.hasNativeAudio && !this.hasWebAudio && !this.hasWebOscillator) {
      return;
    }

    const trigger = async () => {
      if (this.hasWebAudio) {
        const element = this.webAudioElements[request.sampleType] ?? this.webAudioElements.WEAK;
        if (!element) {
          await this.triggerOscillatorFallback(request.sampleType);
          return;
        }

        element.currentTime = 0;
        await element.play().catch(async () => {
          await this.triggerOscillatorFallback(request.sampleType);
        });
        return;
      }

      if (this.hasWebOscillator) {
        await this.triggerOscillatorFallback(request.sampleType);
        return;
      }

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
    if (!this.hasNativeAudio && !this.hasWebAudio && !this.hasWebOscillator) {
      return;
    }

    if (this.hasWebAudio) {
      Object.values(this.webAudioElements).forEach((element) => {
        if (element) {
          element.pause();
          element.currentTime = 0;
        }
      });
    }

    if (this.hasWebOscillator && this.webAudioContext?.state === 'running') {
      // no-op: oscillators are short one-shot sounds, clearing scheduled playback is sufficient.
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

    if (this.hasWebAudio || this.hasWebOscillator) {
      await this.initializeWebFallbacks();
      return;
    }

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
    if (!this.hasNativeAudio && !this.hasWebAudio && !this.hasWebOscillator) {
      this.isLoaded = false;
      return;
    }

    if (this.hasWebAudio || this.hasWebOscillator) {
      this.webAudioElements = {};
      this.hasWebAudio = false;
      this.hasWebOscillator = false;
      this.webAudioContext = null;
      this.isLoaded = false;
      return;
    }

    await this.unloadSamples();
    this.isLoaded = false;
  }

  private async initializeWebFallbacks(): Promise<void> {
    await this.initializeWebAudioFallback();
    this.initializeOscillatorFallback();
  }

  private async initializeWebAudioFallback(): Promise<void> {
    if (!supportsWebAudioElement()) {
      this.hasWebAudio = false;
      return;
    }

    const library = MRIDANGAM_SAMPLE_LIBRARY[this.instrumentId] ?? MRIDANGAM_SAMPLE_LIBRARY[DEFAULT_INSTRUMENT];
    this.webAudioElements = Object.fromEntries(
      (Object.keys(library) as BeatSampleType[]).map((sampleType) => {
        const audio = new Audio(library[sampleType]) as WebAudioLike;
        audio.preload = 'auto';
        return [sampleType, audio] as const;
      })
    );
    this.hasWebAudio = true;
  }

  private initializeOscillatorFallback(): void {
    if (!supportsWebAudioContext()) {
      this.hasWebOscillator = false;
      return;
    }

    if (!this.webAudioContext) {
      const maybeAudioContext = globalThis as {
        AudioContext?: new () => WebAudioContextLike;
        webkitAudioContext?: new () => WebAudioContextLike;
      };
      const Ctor = maybeAudioContext.AudioContext ?? maybeAudioContext.webkitAudioContext;
      if (!Ctor) {
        this.hasWebOscillator = false;
        return;
      }
      this.webAudioContext = new Ctor();
    }

    this.hasWebOscillator = true;
  }

  private async triggerOscillatorFallback(sampleType: BeatSampleType): Promise<void> {
    if (!this.hasWebOscillator) {
      return;
    }

    const context = this.webAudioContext;
    if (!context) {
      return;
    }

    if (context.state === 'suspended') {
      await context.resume().catch(() => undefined);
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const frequency = sampleType === 'STRONG' ? 220 : sampleType === 'MEDIUM' ? 190 : 160;
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.08);
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
