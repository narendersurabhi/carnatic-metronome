import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveBeatDisplay } from '../components/zen/ActiveBeatDisplay';
import { BottomNav } from '../components/zen/BottomNav';
import { InstrumentStatus } from '../components/zen/InstrumentStatus';
import { PlayPauseButton } from '../components/zen/PlayPauseButton';
import { RhythmCycleRing } from '../components/zen/RhythmCycleRing';
import { TalaContextHeader } from '../components/zen/TalaContextHeader';
import { TempoControl } from '../components/zen/TempoControl';
import { TopBar } from '../components/zen/TopBar';
import { zenColors } from '../theme/zenTheme';
import { getAngaBeatCount, getTalaDefinition } from '../tala-engine';
import { useMetronomeStore } from '../store/metronomeStore';

type AngaLabel = 'Laghu' | 'Dhrutam' | 'Anudhrutam';

const toTitle = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

export const PlayerScreen = () => {
  const {
    selectedTala,
    selectedJati,
    selectedInstrument,
    bpm,
    isPlaying,
    currentBeatIndex,
    setBpm,
    startMockPlayback,
    stopMockPlayback
  } = useMetronomeStore();

  const talaDefinition = getTalaDefinition(selectedTala);
  const angaLengths = talaDefinition.angaPattern.map((anga) => getAngaBeatCount(anga, selectedJati));
  const totalBeats = angaLengths.reduce((sum, count) => sum + count, 0);
  const angaLabels: AngaLabel[] = talaDefinition.angaPattern.map((a) => (a === 'LAGHU' ? 'Laghu' : a === 'DRUTAM' ? 'Dhrutam' : 'Anudhrutam')) as AngaLabel[];

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <View style={styles.main}>
        <TalaContextHeader
          jatiLabel={`${toTitle(selectedJati)} Jati`}
          talaName={`${toTitle(selectedTala)} Tala`}
          structureLabel={angaLengths.join(' + ')}
        />

        <View style={styles.visualContainer}>
          <RhythmCycleRing
            size={340}
            angaLengths={angaLengths}
            angaLabels={angaLabels}
            activeBeatIndex={currentBeatIndex}
            totalBeats={totalBeats}
          />
          <View style={styles.centerContent}>
            <ActiveBeatDisplay beatLabel={`${currentBeatIndex + 1}`} />
            <PlayPauseButton onToggle={isPlaying ? stopMockPlayback : startMockPlayback} isPlaying={isPlaying} />
          </View>
        </View>

        <TempoControl
          bpm={bpm}
          min={30}
          max={240}
          onDecrement={() => setBpm(bpm - 1)}
          onIncrement={() => setBpm(bpm + 1)}
        />

        <View style={styles.instrumentWrap}>
          <InstrumentStatus instrument={selectedInstrument} />
        </View>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: zenColors.background
  },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 120,
    paddingHorizontal: 24
  },
  visualContainer: {
    width: 360,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instrumentWrap: {
    position: 'absolute',
    bottom: 100
  }
});
