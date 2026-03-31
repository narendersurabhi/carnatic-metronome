import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props {
  label: string;
  value: number;
  unit?: string;
  color?: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const RangeSliderRow = ({ label, value, unit = '', color = builderColors.gold, onDecrease, onIncrease }: Props) => (
  <View style={styles.group}>
    <View style={styles.top}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}{unit}</Text></View>
    <View style={styles.row}>
      <Pressable onPress={onDecrease}><Text style={styles.adjust}>−</Text></Pressable>
      <View style={styles.track}><View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} /></View>
      <Pressable onPress={onIncrease}><Text style={styles.adjust}>＋</Text></Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  group: { gap: 6 },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#9a8f80', fontSize: 12 },
  value: { color: builderColors.textPrimary, fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adjust: { color: builderColors.gold, fontSize: 16 },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: builderColors.surfaceHighest },
  fill: { height: 6, borderRadius: 3 }
});
