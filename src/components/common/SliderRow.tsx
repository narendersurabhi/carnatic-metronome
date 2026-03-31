import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <View style={styles.group}>
    <View style={styles.top}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>
    <View style={styles.row}><Pressable onPress={() => onChange(Math.max(0, value - 1))}><Text style={styles.adjust}>−</Text></Pressable><View style={styles.track}><View style={[styles.fill, { width: `${value}%` }]} /></View><Pressable onPress={() => onChange(Math.min(200, value + 1))}><Text style={styles.adjust}>＋</Text></Pressable></View>
  </View>
);

const styles = StyleSheet.create({
  group: { gap: 6 }, top: { flexDirection: 'row', justifyContent: 'space-between' }, label: { color: '#9a8f80', fontSize: 12 }, value: { color: colors.text, fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 }, adjust: { color: colors.gold, fontSize: 16 }, track: { flex: 1, backgroundColor: colors.surfaceHigh, borderRadius: 4, height: 6, overflow: 'hidden' }, fill: { height: 6, backgroundColor: colors.gold }
});
