# Carnatic Metronome App Foundation (Expo + TypeScript)

This repository now includes the requested app foundation with shared design system, shared navigation, domain models, mock global state, and feature screens.

## Foundation structure
- `features/player`
- `features/tala`
- `features/settings`
- `features/templates`
- `components/navigation`
- `components/common`
- `components/tala`
- `components/templates`
- `state`
- `theme`
- `services/audio`
- `domain`

## Implemented
- Expo + TypeScript app shell with bottom-tab navigation (Player, Talas, Templates, Settings)
- Shared theme tokens (colors, typography, spacing, card/button/nav styles)
- Global mock store for selected tala/jati, bpm, instrument, sruthi, drone and gains, current/saved templates
- Domain models for Tala/Jati/Anga/Beat/TemplateBlock/TalaTemplate/PlayerSettings/SoundSettings
- Audio service interface placeholder (`play/pause/stop/setTempo/setInstrument/preloadSamples`)
- Shared reusable components and feature screens wired to mock state
- Template builder tap-to-add and tap-to-remove interactions

## Not implemented yet
- Final low-latency audio engine
- Persistence
- PDF export implementation (button placeholder only)
- Backend
