import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppStore } from '../../state/appStore';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { RhythmCycleRing } from '../../components/tala/RhythmCycleRing';
import { colors } from '../../theme/tokens';
import { JATIS, SAPTA_TALA_DEFINITIONS, computeTemplateAksharas, derivePlayerSummaryText } from '../../domain/tala';

export const PlayerScreen = () => {
  const {
    selectedTala,
    selectedJati,
    bpm,
    selectedInstrument,
    sruthi,
    currentTemplate,
    isPlaying,
    togglePlay,
    activeBeat,
    tickBeat
  } = useAppStore();

  const talaName = useMemo(
    () => SAPTA_TALA_DEFINITIONS.find((t) => t.id === selectedTala)?.name ?? selectedTala,
    [selectedTala]
  );
  const jatiName = useMemo(() => JATIS.find((j) => j.id === selectedJati)?.name ?? selectedJati, [selectedJati]);
  const templateAksharas = useMemo(() => computeTemplateAksharas(currentTemplate.blocks, selectedJati), [currentTemplate, selectedJati]);
  const summaryText = useMemo(
    () =>
      derivePlayerSummaryText({
        talaName,
        jatiName,
        bpm,
        instrument: selectedInstrument,
        sruthi,
        templateName: currentTemplate.name,
        totalAksharas: templateAksharas
      }),
    [bpm, currentTemplate.name, jatiName, selectedInstrument, sruthi, talaName, templateAksharas]
  );

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => tickBeat(Math.max(1, templateAksharas)), Math.round(60000 / bpm));
    return () => clearInterval(id);
  }, [isPlaying, bpm, templateAksharas, tickBeat]);

  return (
    <View style={styles.screen}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.overline}>{jatiName} Jati</Text>
        <Text style={styles.title}>{talaName}</Text>
        <RhythmCycleRing activeBeat={activeBeat} totalBeats={Math.max(1, templateAksharas)} />
        <View style={styles.stateCard}>
          <Text style={styles.meta}>BPM: {bpm}</Text>
          <Text style={styles.meta}>Instrument: {selectedInstrument}</Text>
          <Text style={styles.meta}>Sruthi: {sruthi}</Text>
          <Text style={styles.meta}>Template: {currentTemplate.name}</Text>
          <Text style={styles.meta}>Template Aksharas: {templateAksharas}</Text>
        </View>
        <Text style={styles.summary}>{summaryText}</Text>
        <Text style={styles.play} onPress={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </Text>
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
  play: { color: colors.gold, borderWidth: 1, borderColor: 'rgba(233,193,118,0.2)', borderRadius: 32, paddingHorizontal: 24, paddingVertical: 12 }
});
