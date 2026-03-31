import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { zenColors } from '../../theme/zenTheme';

interface Props {
  bpm: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export const TempoControl = ({ bpm, min, max, onDecrement, onIncrement }: Props) => {
  const percentage = ((bpm - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TEMPO</Text>
      <View style={styles.row}>
        <Pressable onPress={onDecrement} style={styles.adjustButton}><Text style={styles.adjustText}>−</Text></Pressable>
        <View style={styles.bpmWrap}>
          <Text style={styles.bpm}>{bpm}</Text>
          <Text style={styles.unit}>BPM</Text>
        </View>
        <Pressable onPress={onIncrement} style={styles.adjustButton}><Text style={styles.adjustText}>＋</Text></Pressable>
      </View>

      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 42, width: '100%', maxWidth: 280, alignItems: 'center' },
  label: { color: zenColors.textSubtle, fontSize: 9, letterSpacing: 3, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 26, marginBottom: 20 },
  adjustButton: { padding: 4 },
  adjustText: { color: 'rgba(229,226,225,0.3)', fontSize: 16 },
  bpmWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  bpm: { color: 'rgba(229,226,225,0.86)', fontSize: 32, fontWeight: '300' },
  unit: { color: zenColors.textSubtle, fontSize: 10 },
  sliderTrack: { width: '100%', height: 14, justifyContent: 'center' },
  sliderFill: { height: 1.5, backgroundColor: 'rgba(233,193,118,0.45)' },
  sliderThumb: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
    backgroundColor: zenColors.gold
  }
});
