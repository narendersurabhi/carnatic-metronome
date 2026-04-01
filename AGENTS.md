# Repository Agent Log

This file tracks repository status and changes for future agent context.

## Current Architecture Status
- Expo React Native app foundation implemented with shared tabs and design system.
- Feature folders present:
  - `features/player`
  - `features/tala`
  - `features/settings`
  - `features/templates`
- Shared components and services in requested folders.
- Global mock state and domain models in place.
- Audio remains interface-only placeholder.

## Change Log
### 2026-04-01 (runtime bootstrap fallback for missing Expo native modules)
- Added a React Native entrypoint that registers `main` directly without `expo/AppEntry`.
  - added `index.js`
    - uses `AppRegistry.registerComponent('main', ...)` to ensure app registration still occurs even when Expo native bootstrap modules are unavailable
  - updated `package.json`
    - changed `main` from `expo/AppEntry` to `index.js`
- Result: avoids startup crashes like `Cannot find native module 'ExpoAsset'` / `No native ExponentConstants module` cascading into `"main" has not been registered` when running in runtimes missing Expo native modules.

### 2026-04-01 (player play-button recovery when native audio module is unavailable)
- Fixed Player screen play flow so transport can start even when `expo-av` cannot be loaded in the current runtime.
  - updated `src/services/audio/AudioService.ts`
    - added graceful fallback behavior in `ExpoSampleAudioService.preloadSamples` when `expo-av` import is unavailable
    - avoids throwing preload errors that previously blocked `SamplePlaybackEngine.start()`
    - added no-op guarded behavior for `play`, `stop`, `setInstrument`, and `dispose` when native audio is unavailable
- Result: Play/Pause on `PlayerScreen` continues to drive beat progression and transport state instead of appearing unresponsive in unsupported audio environments.

### 2026-03-31 (phase-5 production hardening + ship readiness)
- Hardened playback flow for safer runtime behavior.
  - updated `src/domain/playbackEngine.ts`
    - added serialized transition guard (`runTransition`) to avoid duplicate start/pause/stop races
    - added preload promise deduplication so sample preload runs once per engine lifecycle
    - improved BPM update handling while running by shifting next scheduled beat timing
    - added `onError` callback wiring and guarded scheduler error handling
    - added app lifecycle helpers: `handleAppBackground`, `handleAudioInterruption`
- Added lightweight analytics hooks without backend dependency.
  - added `src/services/analytics/AnalyticsService.ts`
    - console-backed event tracker for app launch, playback, selection, templates, and audio errors
  - updated `App.tsx`
    - tracks `app_launch` on bootstrap
  - updated `src/features/tala/TalaSelectionScreen.tsx`
    - tracks `tala_selected`
  - updated `src/features/tala/JatiSelectionScreen.tsx`
    - tracks `jati_selected`
  - updated `src/features/templates/TemplateBuilderScreen.tsx`
    - tracks template save/load/play events
  - updated `src/state/playerController.ts`
    - tracks play start/stop and audio errors
- Strengthened persistence reliability and migration-readiness.
  - updated `src/state/appStore.ts`
    - added persisted schema versioning (`version: 2`)
    - added defensive `migrate` + `merge` sanitization for invalid/missing local data
    - persisted `selectedTemplateId`
    - added template lifecycle actions: `loadTemplate`, `deleteTemplate`
- Improved UX polish and touch reliability for key workflows.
  - updated `src/features/player/PlayerScreen.tsx`
    - added loading indicator and dismissible audio error banner
    - upgraded playback controls to `Pressable` with feedback and larger touch targets
  - updated `src/features/templates/TemplateBuilderScreen.tsx`
    - added template-name validation and inline user feedback
    - added saved-template list with load/delete flow
    - added empty-state handling for saved templates
  - updated `src/components/builder/TemplateNameInput.tsx`
    - supports validation messaging and helper text
  - updated `src/components/builder/PrimaryActionButton.tsx`
  - updated `src/components/builder/SecondaryActionButton.tsx`
    - added disabled state, press feedback, and mobile-friendly target height
- Added release preparation placeholders and docs refresh.
  - updated `app.json`
    - added beta metadata placeholders for owner, scheme, bundle/package IDs, icon/splash references, and EAS project ID
  - added assets structure placeholders:
    - `assets/icons/.gitkeep`
    - `assets/splash/.gitkeep`
  - updated `README.md`
    - replaced milestone-only notes with beta-ready run/test/build guidance
- Expanded playback tests for hardening behavior.
  - updated `tests/playerProgression.test.ts`
    - added preload dedupe assertion
    - added app-background pause assertion

### 2026-03-31 (milestone-3 playback progression + tala integration)
- Implemented deterministic cycle derivation helpers to power live player progression.
  - updated `src/domain/models.ts`
    - added framework-independent derived cycle types: `DerivedBeat`, `AngaBoundary`, `DerivedTalaCycle`, `TalaCycleSummary`
  - updated `src/domain/tala.ts`
    - added pure helper functions:
      - `deriveCycleFromSaptaTala`
      - `deriveCycleFromTemplate`
      - `deriveOrderedBeatSequence`
      - `deriveActiveBeatDisplayNumber`
      - `deriveCycleSummary`
      - `getBeatIntervalMs`
    - added anga boundary + beat sequencing derivation with deterministic labels and active beat display support
- Added isolated mock playback engine for progression timing (no native/audio scheduling yet).
  - added `src/domain/playbackEngine.ts`
    - includes `MockPlaybackEngine` with start/pause/stop and BPM update behavior
    - includes pure `getNextBeat` loop helper
- Connected global app state to a dedicated player controller layer.
  - updated `src/state/appStore.ts`
    - replaced toggle-only play state with explicit `playbackState` (`stopped`/`playing`/`paused`)
    - added progression actions: `startPlayback`, `pausePlayback`, `stopPlayback`, `advanceBeat`, `resetActiveBeat`
  - added `src/state/playerController.ts`
    - derives cycle from selected tala/jati/template
    - manages playback progression via `MockPlaybackEngine`
    - resets progression on tala/jati/template changes
- Wired Player feature UI to live progression and new cycle summary data.
  - updated `src/features/player/PlayerScreen.tsx`
    - now consumes `usePlayerController`
    - active beat and cycle totals update live
    - anga boundaries + mode are displayed
    - play/pause and stop controls now drive progression state
- Added Milestone 3 tests for cycle derivation + progression behaviors.
  - added `tests/playerProgression.test.ts`
    - sapta tala sequence derivation assertions
    - jati-driven laghu count assertions
    - custom template totals and anga boundary assertions
    - BPM interval logic assertions
    - loop behavior and runtime BPM change behavior assertions

### 2026-03-31 (milestone-2 state sync + persistence)
- Implemented global state synchronization and persistence baseline for Milestone 2.
  - updated `src/state/appStore.ts`
    - switched to persisted Zustand store (`persist` middleware)
    - persisted: selected tala/jati, player tempo, sound settings, current template, saved templates
    - added template actions: `saveCurrentTemplate`, `setCurrentTemplate`
    - laghu block insertion now respects selected jati beat count
- Expanded pure domain model layer.
  - updated `src/domain/models.ts`
    - added framework-independent types: `Anga`, `Beat`, `PlayerSummaryState`
    - expanded `PlayerSettings` with `selectedTemplateId`
- Added pure helper for player-readable state summary.
  - updated `src/domain/tala.ts`
    - added `derivePlayerSummaryText`
- Centralized default settings in mock/state seed layer.
  - updated `src/state/mockData.ts`
    - added `defaultPlayerSettings`
    - added `defaultSoundSettings`
- Wired screens to shared state more accurately.
  - updated `src/features/player/PlayerScreen.tsx`
    - now reflects tala, jati, instrument, sruthi, bpm, current template, and summary text
  - updated `src/features/tala/TalaSelectionScreen.tsx`
    - tala rows now derive aksharas + anga labels from currently selected jati
  - updated `src/features/templates/TemplateBuilderScreen.tsx`
    - akshara total now computed using selected jati
    - `Save Template` now persists into shared `savedTemplates`
- Extended domain tests for new helper and defaults.
  - updated `tests/domain.test.ts`

### 2026-03-31 (post-jati-fix navigation error hardening)
- Addressed additional navigation errors that appeared after the Jati back-button update.
  - updated `src/components/navigation/BottomNav.tsx`
    - tab navigation now targets the parent tab navigator when rendered inside the Talas stack
    - `Talas` tab press now explicitly routes to `{ screen: 'TalaSelection' }` to avoid stale nested route state
  - updated `src/features/tala/JatiSelectionScreen.tsx`
    - back actions now use `navigation.canGoBack()` guard
    - fallback navigation added to `TalaSelection` when no back history exists
- Result: avoids unhandled `NAVIGATE` / `GO_BACK` actions when Jati screen is opened from non-standard entry paths or after tab switches.

### 2026-03-31 (native-stack onAttached runtime fix)
- Added a runtime compatibility workaround for React Navigation native stack header crash:
  - updated `App.tsx`
  - imported `enableScreens` from `react-native-screens`
  - called `enableScreens(false)` during app bootstrap
- Result: avoids `ScreenStackHeaderConfigNativeComponent.ts: unknown prop type for "onAttached": "undefined"` by opting out of native screen primitives and using JS fallback screens.

### 2026-03-31 (jati back-navigation fix)
- Fixed Talas flow navigation gap from Jati screen back to Tala screen.
  - updated `src/features/tala/JatiSelectionScreen.tsx`
  - added explicit `← Back to Talas` action that calls `navigation.goBack()`
  - wired existing `Cancel & Close` label to also call `navigation.goBack()`
- Result: users can now return from Jati selection to Tala selection without relying on hidden gestures/device back.

### 2026-03-31 (latest update)
- Refactored foundation toward requested app architecture.
- Added shared tab shell and app navigation:
  - `src/components/navigation/AppTabs.tsx`
  - updated `App.tsx` to use tab navigation
- Added shared design system tokens:
  - `src/theme/tokens.ts`
- Added domain models:
  - `src/domain/models.ts`
- Added global mock state:
  - `src/state/appStore.ts`
- Added audio interface placeholder:
  - `src/services/audio/AudioService.ts`
- Added shared reusable components in requested buckets:
  - common: `TopBar`, `SearchBar`, `SectionHeader`, `SliderRow/MixerSlider`
  - navigation: `BottomNav`
  - tala: `AngaBadge`, `PulsePreview`, `RhythmCycleRing`, `InstrumentCard`, `JatiOptionCard`
  - templates: wrappers for `AngaBlockCard`, `SequenceBlockCard`
- Added feature screens with mock state wiring:
  - `features/player/PlayerScreen.tsx`
  - `features/tala/TalaSelectionScreen.tsx`
  - `features/tala/JatiSelectionScreen.tsx`
  - `features/settings/SoundAndSruthiScreen.tsx`
  - `features/templates/TemplateBuilderScreen.tsx`
- Template builder supports tap-to-add and tap-to-remove, no drag/drop.
- Kept final audio engine, persistence, and backend out of scope.

### 2026-03-31 (previous updates)
- Implemented stitch-matched standalone screens and reusable component sets.
- Added scheduler and tala-engine pure TypeScript modules.

### 2026-03-31 (domain/mock-state cleanup)
- Refined domain models to keep tala/jati primitives framework-independent.
  - updated `src/domain/models.ts`
- Added pure TypeScript domain helpers + constants for tala math and labels.
  - added `src/domain/tala.ts`
  - includes:
    - `computeTemplateAksharas`
    - `getLaghuBeatCount`
    - `getAngaBeatCount`
    - `generateAngaLabels`
    - sapta tala + jati base definitions
- Added centralized mock data layer for app state seeding.
  - added `src/state/mockData.ts`
- Updated Zustand store to consume typed domain/state primitives.
  - updated `src/state/appStore.ts`
- Wired tala and jati feature screens to mock data layer (removed inline arrays).
  - updated `src/features/tala/TalaSelectionScreen.tsx`
  - updated `src/features/tala/JatiSelectionScreen.tsx`
- Updated template builder to use shared domain helper for akshara totals.
  - updated `src/features/templates/TemplateBuilderScreen.tsx`
- Added unit tests for domain helpers and mock data integrity.
  - added `tests/domain.test.ts`

### 2026-03-31 (milestone-1 completion pass)
- Strengthened navigation wiring for Milestone 1 acceptance:
  - updated `src/components/navigation/AppTabs.tsx` to include a Talas stack with:
    - `TalaSelection`
    - `JatiSelection`
- Made shared bottom nav interactive (tab switching now pressable):
  - updated `src/components/navigation/BottomNav.tsx`
- Updated tala selection screen to expose navigation to Jati selection flow:
  - updated `src/features/tala/TalaSelectionScreen.tsx`
- Updated player screen to render current global state values for tala/jati/bpm/instrument/template and use computed template aksharas for pulse ring/beat ticking:
  - updated `src/features/player/PlayerScreen.tsx`
- Added Milestone 1 README section and explicit Milestone 2 TODO markers:
  - updated `README.md`
- Added Milestone 2 TODO markers in placeholder audio service implementation:
  - updated `src/services/audio/AudioService.ts`

### 2026-03-31 (phase-4 real audio playback + scheduler integration)
- Replaced mock playback loop with a sample-oriented playback engine.
  - updated `src/domain/playbackEngine.ts`
    - introduced `SamplePlaybackEngine` with explicit transport states (`stopped`/`playing`/`paused`)
    - added look-ahead scheduler loop, beat queueing, cycle wraparound, seek support, and tempo updates while running
    - added UI beat synchronization callbacks decoupled from React screen components
- Implemented replaceable real audio service abstraction and Expo-backed sample playback.
  - updated `src/services/audio/AudioService.ts`
    - expanded audio interface: `preloadSamples`, `play(request)`, `pause`, `stop`, `setTempo`, `setInstrument`, `seekToBeat`, `dispose`
    - added `ExpoSampleAudioService` using preloaded per-accent samples (mridangam default with strong/medium/weak mapping)
    - added timeout-managed scheduling safeguards and unload/dispose lifecycle
    - kept `DebugClickAudioService` fallback for debug/non-audio environments
- Synced player controller to real engine transport rather than component-owned timers.
  - updated `src/state/playerController.ts`
    - now owns one `SamplePlaybackEngine` instance
    - wires state updates from engine callbacks (`activeBeat`, `playbackState`)
    - handles instrument/tempo/cycle updates and serializes rapid play/pause/stop actions to avoid duplicate scheduling
- Added playback validation tests for timing and transport behavior.
  - updated `tests/playerProgression.test.ts`
    - added engine scheduling assertions with fake timers + captured audio events
    - covered BPM interval validation, loop wraparound, tempo-change behavior, and rapid play/pause duplicate-playback prevention checks

### 2026-03-31 (player-screen zen UX refresh inspired by Stitch mock)
- Updated the Player screen to a cleaner, meditation-first layout.
  - updated `src/features/player/PlayerScreen.tsx`
    - removed dense state-card block in favor of minimal context hierarchy (jati, tala, compact structure badge)
    - added central rhythm focus with large-beat presentation via enhanced ring component
    - refined transport controls into larger circular play/stop actions
    - added inline tempo controls directly on Player (`-`, `+`, and tappable tempo track)
    - added de-emphasized instrument caption and kept summary text secondary
- Enhanced rhythm ring visualization to better match target UX language.
  - updated `src/components/tala/RhythmCycleRing.tsx`
    - supports optional anga labels
    - renders subtle beat markers around the ring
    - adds active-beat orbit dot and larger glowing center beat numeral
