export type SampleType = 'STRONG' | 'MEDIUM' | 'WEAK';

export interface ScheduledBeat {
  beatIndex: number;
  sampleType: SampleType;
  atTimeMs: number;
}

export interface Clock {
  nowMs(): number;
}

export interface AudioQueuePort {
  enqueue(beat: ScheduledBeat): void;
}

export interface SchedulerConfig {
  bpm: number;
  lookAheadMs: number;
  scheduleIntervalMs: number;
}

export interface BeatPattern {
  beatIndex: number;
  sampleType: SampleType;
}
