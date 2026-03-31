import { useEffect, useMemo, useRef } from 'react';

import { MockPlaybackEngine } from '../domain/playbackEngine';
import { deriveOrderedBeatSequence } from '../domain/tala';
import { useAppStore } from './appStore';

export const usePlayerController = () => {
  const {
    selectedTala,
    selectedJati,
    currentTemplate,
    bpm,
    playbackState,
    activeBeat,
    startPlayback,
    pausePlayback,
    stopPlayback,
    advanceBeat,
    resetActiveBeat
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
  const engineRef = useRef<MockPlaybackEngine | null>(null);
  const totalAksharasRef = useRef(totalAksharas);

  useEffect(() => {
    totalAksharasRef.current = totalAksharas;
  }, [totalAksharas]);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new MockPlaybackEngine({
        bpm,
        totalAksharas,
        onTick: () => advanceBeat(totalAksharasRef.current)
      });
      return;
    }

    engineRef.current.updateBpm(bpm);
    engineRef.current.updateTotalAksharas(totalAksharas);
  }, [advanceBeat, bpm, totalAksharas]);

  useEffect(() => {
    resetActiveBeat();
  }, [selectedTala, selectedJati, currentTemplate.id, currentTemplate.blocks, resetActiveBeat]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }

    if (playbackState !== 'playing') {
      engine.pause();
      return;
    }

    engine.start();

    return () => {
      if (engineRef.current) {
        engineRef.current.pause();
      }
    };
  }, [playbackState]);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const togglePlayPause = () => {
    if (playbackState === 'playing') {
      pausePlayback();
      return;
    }

    startPlayback();
  };

  return {
    cycle,
    totalAksharas,
    activeBeat,
    bpm,
    playbackState,
    controls: {
      togglePlayPause,
      stopPlayback
    }
  };
};
