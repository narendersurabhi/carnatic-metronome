# Carnatic Metronome (Expo + TypeScript)

Carnatic Metronome is a React Native/Expo app for tala practice with deterministic cycle derivation, editable tala templates, and sample-based playback.

## Current Scope (Phase 5)

- Robust playback with preload safeguards, serialized transport transitions, and tempo updates while running.
- Improved UX for player and template builder, including validation, feedback states, and comfortable touch targets.
- Persisted tala/jati/settings/template data with migration-ready, defensive hydration.
- Lightweight local analytics hooks (console-based) for launch, playback, tala/jati selection, template lifecycle, and audio errors.
- Release prep placeholders for metadata, icon assets, splash assets, and package identifiers.

## Run

```bash
npm install
npm run start
```

## Test

```bash
npm run test
```

## Build (beta readiness)

> Configure `app.json` placeholders first (`owner`, bundle/package IDs, EAS project ID, icon/splash assets).

```bash
npm run android
npm run ios
```

For cloud beta builds, use EAS once credentials are configured.

## Notes

- Analytics is intentionally lightweight and backend-free in this phase.
- Audio playback uses `expo-av` sample scheduling and includes debug-safe fallbacks.
- Persistence is local-only; no backend dependencies are required.
