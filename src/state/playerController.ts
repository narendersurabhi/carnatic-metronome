import { useEffect, useMemo, useRef } from 'react';

import { SamplePlaybackEngine } from '../domain/playbackEngine';
import { ExpoSampleAudioService } from '../services/audio/AudioService';
import { deriveOrderedBeatSequence } from '../domain/tala';
import { useAppStore } from './appStore';

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
  const actionRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new SamplePlaybackEngine({
        bpm,
        totalAksharas,
        audioService: new ExpoSampleAudioService(),
        onBeat: (beat) => setField('activeBeat', beat),
        onStateChange: (nextState) => setField('playbackState', nextState)
      });
      return;
    }

    void engineRef.current.updateBpm(bpm);
    engineRef.current.updateTotalAksharas(totalAksharas);
  }, [bpm, setField, totalAksharas]);

  useEffect(() => {
    void engineRef.current?.setInstrument(selectedInstrument);
  }, [selectedInstrument]);

  useEffect(() => {
    void engineRef.current?.seekToBeat(1);
  }, [selectedTala, selectedJati, currentTemplate.id, currentTemplate.blocks]);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        void engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  const runSerially = (operation: () => Promise<void>) => {
    if (actionRef.current) {
      return;
    }

    actionRef.current = operation().finally(() => {
      actionRef.current = null;
    });
  };

  const togglePlayPause = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }

    if (playbackState === 'playing') {
      runSerially(() => engine.pause());
      return;
    }

    runSerially(() => engine.start());
  };

  const stop = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }

    runSerially(() => engine.stop());
  };

  return {
    cycle,
    totalAksharas,
    activeBeat,
    bpm,
    playbackState,
    controls: {
      togglePlayPause,
      stopPlayback: stop
    }
  };
};
