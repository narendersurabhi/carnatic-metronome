import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props {
  totalAksharas: number;
  angaCount: number;
}

export const SequenceStatsCard = ({ totalAksharas, angaCount }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.heading}>Sequence Stats</Text>
    <View style={styles.row}><Text style={styles.label}>Total Aksharas</Text><Text style={styles.valueGold}>{String(totalAksharas).padStart(2, '0')}</Text></View>
    <View style={styles.row}><Text style={styles.label}>Anga Count</Text><Text style={styles.value}>{angaCount}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { backgroundColor: builderColors.surfaceLow, borderRadius: 4, padding: 16, gap: 8 },
  heading: { color: builderColors.textVariant, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { color: '#9a8f80', fontSize: 12 },
  value: { color: builderColors.textPrimary, fontSize: 26 },
  valueGold: { color: builderColors.gold, fontSize: 26 }
});
