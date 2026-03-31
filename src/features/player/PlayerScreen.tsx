import React, { useMemo, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStore } from '../../state/appStore';
import { usePlayerController } from '../../state/playerController';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { RhythmCycleRing } from '../../components/tala/RhythmCycleRing';
import { colors } from '../../theme/tokens';
import { JATIS, SAPTA_TALA_DEFINITIONS, deriveCycleSummary, derivePlayerSummaryText } from '../../domain/tala';

export const PlayerScreen = () => {
  const { selectedTala, selectedJati, selectedInstrument, currentTemplate, setField } = useAppStore();
  const { activeBeat, bpm, cycle, totalAksharas, playbackState, audioError, controls } = usePlayerController();
  const [tempoTrackWidth, setTempoTrackWidth] = useState(1);

  const minBpm = 20;
  const maxBpm = 300;

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
        sruthi: 'Set in Settings',
        templateName: currentTemplate.name,
        totalAksharas
      }),
    [bpm, currentTemplate.name, jatiName, selectedInstrument, talaName, totalAksharas]
  );

  const isLoading = playbackState === 'playing' && activeBeat <= 1;
  const structureLabel = cycle.angaBoundaries.map((anga) => `${anga.endBeat - anga.startBeat + 1}`).join(' + ');
  const tempoProgress = Math.min(1, Math.max(0, (bpm - minBpm) / (maxBpm - minBpm)));
  const tempoThumbPercent = `${tempoProgress * 100}%`;
  const angaLabels = cycle.angaBoundaries.map((anga) => anga.label);

  const applyBpm = (next: number) => {
    setField('bpm', Math.max(minBpm, Math.min(maxBpm, Math.round(next))));
  };

  const handleTempoTrackLayout = (event: LayoutChangeEvent) => {
    setTempoTrackWidth(Math.max(1, event.nativeEvent.layout.width));
  };

  const handleTempoTrackPress = (locationX: number) => {
    const ratio = Math.min(1, Math.max(0, locationX / tempoTrackWidth));
    applyBpm(minBpm + ratio * (maxBpm - minBpm));
  };

  return (
    <View style={styles.screen}>
      <TopBar showQuickStart={false} />
      <View style={styles.content}>
        <Text style={styles.overline}>{jatiName} Jati</Text>
        <Text style={styles.title}>{talaName}</Text>
        <View style={styles.structureBadge}>
          <Text style={styles.structureText}>{structureLabel || 'No anga structure'}</Text>
        </View>
        <RhythmCycleRing
          activeBeat={cycleSummary.activeBeatDisplayNumber}
          totalBeats={Math.max(1, cycleSummary.totalAksharas)}
          angaLabels={angaLabels}
        />
        {isLoading ? <ActivityIndicator color={colors.gold} /> : null}
        {audioError ? (
          <Pressable onPress={controls.clearAudioError}>
            <Text style={styles.error}>Audio issue: {audioError} (tap to dismiss)</Text>
          </Pressable>
        ) : null}
        <View style={styles.controlsWrap}>
          <Pressable style={({ pressed }) => [styles.play, pressed && styles.pressed]} onPress={controls.togglePlayPause}>
            <Text style={styles.controlLabel}>{playbackState === 'playing' ? 'Pause' : 'Play'}</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.stop, pressed && styles.pressed]} onPress={controls.stopPlayback}>
            <Text style={styles.controlLabel}>Stop</Text>
          </Pressable>
        </View>
        <View style={styles.tempoSection}>
          <Text style={styles.tempoLabel}>Tempo</Text>
          <View style={styles.tempoRow}>
            <Pressable style={styles.tempoStepButton} onPress={() => applyBpm(bpm - 1)}>
              <Text style={styles.tempoStepLabel}>−</Text>
            </Pressable>
            <View>
              <Text style={styles.tempoValue}>{bpm}</Text>
              <Text style={styles.tempoUnit}>BPM</Text>
            </View>
            <Pressable style={styles.tempoStepButton} onPress={() => applyBpm(bpm + 1)}>
              <Text style={styles.tempoStepLabel}>＋</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.tempoTrack}
            onLayout={handleTempoTrackLayout}
            onPress={(event) => handleTempoTrackPress(event.nativeEvent.locationX)}
          >
            <View style={[styles.tempoProgress, { width: tempoThumbPercent }]} />
            <View style={[styles.tempoThumb, { left: tempoThumbPercent }]} />
          </Pressable>
        </View>
        <Text style={styles.instrument}>{selectedInstrument.toUpperCase()}</Text>
        <Text style={styles.summary}>{summaryText}</Text>
      </View>
      <BottomNav active="Player" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 86, paddingHorizontal: 24 },
  overline: { color: 'rgba(229,226,225,0.4)', letterSpacing: 4, textTransform: 'uppercase', fontSize: 10 },
  title: { color: colors.text, fontSize: 40, textAlign: 'center', fontWeight: '300' },
  structureBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6
  },
  structureText: { color: 'rgba(229,226,225,0.5)', fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase' },
  summary: { color: colors.gold, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  error: { color: '#d95858', fontSize: 12, textAlign: 'center' },
  controlsWrap: { flexDirection: 'row', gap: 12, marginTop: 2 },
  play: { borderWidth: 1, borderColor: 'rgba(233,193,118,0.28)', borderRadius: 36, minHeight: 62, minWidth: 92, justifyContent: 'center', alignItems: 'center' },
  stop: { borderWidth: 1, borderColor: colors.outline, borderRadius: 36, minHeight: 62, minWidth: 92, justifyContent: 'center', alignItems: 'center' },
  controlLabel: { color: colors.gold, fontSize: 16, fontWeight: '600', letterSpacing: 0.2 },
  tempoSection: { width: '100%', maxWidth: 280, marginTop: 8 },
  tempoLabel: { color: 'rgba(229,226,225,0.4)', textTransform: 'uppercase', letterSpacing: 3, fontSize: 9, textAlign: 'center' },
  tempoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 8 },
  tempoValue: { color: 'rgba(229,226,225,0.86)', fontSize: 36, fontWeight: '300', textAlign: 'center' },
  tempoUnit: { color: 'rgba(229,226,225,0.35)', fontSize: 10, letterSpacing: 1.2, textAlign: 'center' },
  tempoStepButton: { minWidth: 38, minHeight: 38, justifyContent: 'center', alignItems: 'center' },
  tempoStepLabel: { color: 'rgba(229,226,225,0.45)', fontSize: 24, lineHeight: 24 },
  tempoTrack: {
    height: 16,
    marginTop: 10,
    justifyContent: 'center',
    position: 'relative'
  },
  tempoProgress: {
    height: 2,
    backgroundColor: 'rgba(233,193,118,0.42)',
    borderRadius: 999
  },
  tempoThumb: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    top: 4,
    marginLeft: -4
  },
  instrument: { color: 'rgba(229,226,225,0.45)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 },
  pressed: { opacity: 0.8 }
});
