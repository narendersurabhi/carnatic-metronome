import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';

interface Props {
  icon: string;
  title: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const MixerSlider = ({ icon, title, value, leftLabel, rightLabel, onDecrease, onIncrease }: Props) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.value}>{pct}%</Text>
      </View>
      <View style={styles.sliderRow}>
        <Pressable onPress={onDecrease}><Text style={styles.adjust}>−</Text></Pressable>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
          <View style={[styles.thumb, { left: `${pct}%` }]} />
        </View>
        <Pressable onPress={onIncrease}><Text style={styles.adjust}>＋</Text></Pressable>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footLabel}>{leftLabel}</Text>
        <Text style={styles.footLabel}>{rightLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { color: soundColors.gold, fontSize: 16 },
  title: { color: soundColors.textPrimary, fontSize: 24 },
  value: { color: soundColors.gold, fontSize: 16, fontWeight: '700', borderBottomWidth: 1, borderBottomColor: soundColors.borderStrong },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adjust: { color: soundColors.gold, fontSize: 18 },
  track: { flex: 1, height: 20, justifyContent: 'center' },
  fill: { height: 4, backgroundColor: soundColors.gold },
  thumb: { position: 'absolute', marginLeft: -6, width: 12, height: 22, borderRadius: 2, borderWidth: 1, borderColor: soundColors.goldBright, backgroundColor: soundColors.gold },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  footLabel: { color: soundColors.textMuted, fontSize: 9, letterSpacing: 2, opacity: 0.6 }
});
