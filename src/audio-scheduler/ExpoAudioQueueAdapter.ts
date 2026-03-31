import { AudioQueuePort, ScheduledBeat } from './types';

/**
 * Adapter seam for Expo audio implementation.
 *
 * Intentionally does not play audio directly yet. The app can inject an
 * implementation later (expo-audio/expo-av or native module) without changing
 * scheduler logic.
 */
export class ExpoAudioQueueAdapter implements AudioQueuePort {
  private readonly sink: (beat: ScheduledBeat) => void;

  constructor(sink: (beat: ScheduledBeat) => void) {
    this.sink = sink;
  }

  enqueue(beat: ScheduledBeat): void {
    this.sink(beat);
  }
}
