# Carnatic Metronome App Foundation (Expo + TypeScript)

This repository includes **Milestone 1** of the Carnatic Metronome app: a runnable Expo React Native foundation with shared navigation, design system, domain primitives, and mock state.

## Milestone 1 scope

### ✅ Delivered in Milestone 1
- Expo + TypeScript app shell runs with `expo start`
- Bottom-tab architecture with app-wide navigation
- Feature screens implemented and wired:
  - `PlayerScreen`
  - `TalaSelectionScreen`
  - `JatiSelectionScreen`
  - `SoundAndSruthiScreen`
  - `TemplateBuilderScreen`
- Shared theme tokens applied across the feature screens
- Shared Zustand mock state used across player/tala/jati/settings/templates
- Tala selection updates current tala in global state
- Jati selection updates current jati in global state
- Instrument + sruthi + levels update global sound settings
- Template builder supports mock add/remove anga block interactions
- Player screen reflects selected tala, jati, bpm, instrument, and current template visually
- No backend and no persistence included
- Audio remains placeholder-only service

### Milestone 1 structure
- `src/features/player`
- `src/features/tala`
- `src/features/settings`
- `src/features/templates`
- `src/components/navigation`
- `src/components/common`
- `src/components/tala`
- `src/components/templates`
- `src/state`
- `src/theme`
- `src/services/audio`
- `src/domain`

## Deferred to Milestone 2
- TODO(M2): Add persistence for user settings and templates.
- TODO(M2): Wire template playback to the tala-engine runtime sequence.
- TODO(M2): Replace mock audio service with real low-latency audio scheduling.
