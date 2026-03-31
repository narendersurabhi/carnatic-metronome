import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppStore } from '../../state/appStore';
import { usePlayerController } from '../../state/playerController';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { RhythmCycleRing } from '../../components/tala/RhythmCycleRing';
import { colors } from '../../theme/tokens';
import { JATIS, SAPTA_TALA_DEFINITIONS, deriveCycleSummary, derivePlayerSummaryText } from '../../domain/tala';

export const PlayerScreen = () => {
  const { selectedTala, selectedJati, selectedInstrument, sruthi, currentTemplate } = useAppStore();
  const { activeBeat, bpm, cycle, totalAksharas, playbackState, controls } = usePlayerController();

  const talaName = useMemo(
    () => SAPTA_TALA_DEFINITIONS.find((t) => t.id === selectedTala)?.name ?? selectedTala,
    [selectedTala]
  );
  const jatiName = useMemo(() => JATIS.find((j) => j.id === selectedJati)?.name ?? selectedJati, [selectedJati]);
  const cycleSummary = useMemo(
    () =>
      deriveCycleSummary({
        talaId: selectedTala,
        jati: selectedJati,
        activeBeatIndex: activeBeat,
        template: currentTemplate
      }),
    [activeBeat, currentTemplate, selectedJati, selectedTala]
  );
  const summaryText = useMemo(
    () =>
      derivePlayerSummaryText({
        talaName,
        jatiName,
        bpm,
        instrument: selectedInstrument,
        sruthi,
        templateName: currentTemplate.name,
        totalAksharas
      }),
    [bpm, currentTemplate.name, jatiName, selectedInstrument, sruthi, talaName, totalAksharas]
  );

  return (
    <View style={styles.screen}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.overline}>{jatiName} Jati</Text>
        <Text style={styles.title}>{talaName}</Text>
        <RhythmCycleRing activeBeat={cycleSummary.activeBeatDisplayNumber} totalBeats={Math.max(1, cycleSummary.totalAksharas)} />
        <View style={styles.stateCard}>
          <Text style={styles.meta}>BPM: {bpm}</Text>
          <Text style={styles.meta}>Instrument: {selectedInstrument}</Text>
          <Text style={styles.meta}>Sruthi: {sruthi}</Text>
          <Text style={styles.meta}>Template: {currentTemplate.name}</Text>
          <Text style={styles.meta}>Aksharas: {totalAksharas}</Text>
          <Text style={styles.meta}>Angas: {cycle.angaBoundaries.map((anga) => anga.label).join(' · ')}</Text>
          <Text style={styles.meta}>Mode: {cycle.source}</Text>
        </View>
        <Text style={styles.summary}>{summaryText}</Text>
        <View style={styles.controls}>
          <Text style={styles.play} onPress={controls.togglePlayPause}>
            {playbackState === 'playing' ? 'Pause' : 'Play'}
          </Text>
          <Text style={styles.stop} onPress={controls.stopPlayback}>
            Stop
          </Text>
        </View>
      </View>
      <BottomNav active="Player" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80, paddingHorizontal: 24 },
  overline: { color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 42, textAlign: 'center' },
  stateCard: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
    minWidth: 260,
    backgroundColor: colors.surfaceLow
  },
  meta: { color: colors.textMuted, textAlign: 'center' },
  summary: { color: colors.gold, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  controls: { flexDirection: 'row', gap: 12 },
  play: { color: colors.gold, borderWidth: 1, borderColor: 'rgba(233,193,118,0.2)', borderRadius: 32, paddingHorizontal: 24, paddingVertical: 12 },
  stop: { color: colors.textMuted, borderWidth: 1, borderColor: colors.outline, borderRadius: 32, paddingHorizontal: 24, paddingVertical: 12 }
});
