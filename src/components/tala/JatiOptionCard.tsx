import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';
import { PulsePreview } from './PulsePreview';

export const JatiOptionCard = ({ name, desc, count, active, onPress }: { name: string; desc: string; count: number; active?: boolean; onPress: () => void }) => (
  <Pressable style={[styles.card, active && styles.active]} onPress={onPress}>
    {active ? <View style={styles.leftBar} /> : null}
    <Text style={[styles.name, active && styles.nameActive]}>{name}</Text>
    <Text style={styles.desc}>{desc}</Text>
    <View style={styles.bottom}><PulsePreview count={count} active={active} /><Text style={[styles.count, active && styles.nameActive]}>{count}</Text></View>
  </Pressable>
);

const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: 4, padding: 16, gap: 8, position: 'relative' }, active: { backgroundColor: colors.surfaceLow }, leftBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: colors.gold }, name: { color: colors.text, fontSize: 30 }, nameActive: { color: colors.gold }, desc: { color: colors.textMuted, fontSize: 14 }, bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, count: { color: colors.textMuted, fontSize: 36 } });
