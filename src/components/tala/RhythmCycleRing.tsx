import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/tokens';

export const RhythmCycleRing = ({ activeBeat, totalBeats }: { activeBeat: number; totalBeats: number }) => (
  <View style={styles.ring}><Text style={styles.text}>{activeBeat}/{totalBeats}</Text></View>
);

const styles = StyleSheet.create({ ring: { width: 320, height: 320, borderRadius: 160, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }, text: { color: colors.gold, fontSize: 38, fontWeight: '700' } });
