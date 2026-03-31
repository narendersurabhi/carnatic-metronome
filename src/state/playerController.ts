import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { SamplePlaybackEngine } from '../domain/playbackEngine';
import { ExpoSampleAudioService } from '../services/audio/AudioService';
import { deriveOrderedBeatSequence } from '../domain/tala';
import { useAppStore } from './appStore';
import { analytics } from '../services/analytics/AnalyticsService';

export const usePlayerController = () => {
  const {
    selectedTala,
    selectedJati,
    currentTemplate,
    selectedInstrument,
    bpm,
    playbackState,
    activeBeat,
    setField
  } = useAppStore();

  const [audioError, setAudioError] = useState<string | null>(null);

  const cycle = useMemo(
    () =>
      deriveOrderedBeatSequence({
        talaId: selectedTala,
        jati: selectedJati,
        template: currentTemplate
      }),
    [currentTemplate, selectedJati, selectedTala]
  );

  const totalAksharas = Math.max(1, cycle.totalAksharas);
  const engineRef = useRef<SamplePlaybackEngine | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new SamplePlaybackEngine({
        bpm,
        totalAksharas,
        audioService: new ExpoSampleAudioService(),
        onBeat: (beat) => setField('activeBeat', beat),
        onStateChange: (nextState) => {
          setField('playbackState', nextState);
          if (nextState === 'playing') {
            analytics.track('play_start', { talaId: selectedTala, jati: selectedJati, templateId: currentTemplate.id });
          }
          if (nextState === 'stopped') {
            analytics.track('play_stop', { talaId: selectedTala, jati: selectedJati, templateId: currentTemplate.id });
          }
        },
        onError: (error) => {
          setAudioError(error.message);
          analytics.track('audio_error', { message: error.message });
        }
      });
      return;
    }

    void engineRef.current.updateBpm(bpm);
    engineRef.current.updateTotalAksharas(totalAksharas);
  }, [bpm, currentTemplate.id, selectedJati, selectedTala, setField, totalAksharas]);

  useEffect(() => {
    void engineRef.current?.setInstrument(selectedInstrument);
  }, [selectedInstrument]);

  useEffect(() => {
    void engineRef.current?.seekToBeat(1);
  }, [selectedTala, selectedJati, currentTemplate.id, currentTemplate.blocks]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appStateRef.current === 'active';
      appStateRef.current = nextState;

      if (wasActive && nextState.match(/inactive|background/)) {
        void engineRef.current?.handleAppBackground();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        void engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  const togglePlayPause = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }

    setAudioError(null);
    if (playbackState === 'playing') {
      void engine.pause();
      return;
    }

    analytics.track('template_play', { templateId: currentTemplate.id, templateName: currentTemplate.name });
    void engine.start();
  };

  const stop = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }

    void engine.stop();
  };

  return {
    cycle,
    totalAksharas,
    activeBeat,
    bpm,
    playbackState,
    audioError,
    controls: {
      togglePlayPause,
      stopPlayback: stop,
      clearAudioError: () => setAudioError(null)
    }
  };
};
