# Audio Scheduling Design & Platform Evaluation

## Scheduling module design

Implemented module: `src/audio-scheduler/*`

### Goals covered
- **Precise beat timing**: scheduler computes absolute timestamps (`atTimeMs`) from bpm and monotonic clock.
- **Pre-scheduling**: each tick schedules all beats within a look-ahead window (`lookAheadMs`).
- **Multiple sample types**: `SampleType` supports `STRONG | MEDIUM | WEAK`.
- **UI decoupling**: scheduling logic runs in pure TS service (`AudioScheduler`) behind `Clock` + `AudioQueuePort` interfaces.

### Runtime model
1. Build beat pattern from tala accents (`buildBeatPattern`).
2. Start scheduler with interval (e.g. 25ms).
3. On each interval, scheduler enqueues all beats up to `now + lookAheadMs`.
4. Audio adapter (Expo or native) consumes queue and triggers sample playback.

## Expo AV / Expo Audio evaluation

### What Expo docs indicate
- `expo-av` Audio is now **deprecated** in favor of `expo-audio`.
- `expo-audio` is current cross-platform audio API and provides player lifecycle hooks and status updates.

### Limitation assessment for metronome-grade timing
- Expo audio APIs are high-level player APIs and expose status/update intervals.
- No explicit sample-accurate "play at absolute hardware timestamp" API is documented in Expo SDK docs.
- Therefore, exact metronome tightness under JS load may drift if scheduling depends on JS timer cadence.

> Inference: for strict rhythmic accuracy (especially at high BPM/subdivisions), JS-thread-driven timing may not stay tight enough across devices.

## When to move to a native module

Use the current scheduler+adapter seam first. Escalate to a native module if measured drift exceeds target tolerance.

### Suggested drift criteria
- Mean absolute timing error > 10ms over 2 minutes, or
- Peak error > 20ms repeatedly, or
- Audible flam/jitter with strong accents at target BPM range.

### Native path
- Keep `AudioScheduler` and `BeatPattern` unchanged.
- Replace queue consumer with native/JNI/Obj-C++ scheduled playback (timestamp-based triggering on audio thread).
- Continue using React Native/Expo UI for controls and visualization.
