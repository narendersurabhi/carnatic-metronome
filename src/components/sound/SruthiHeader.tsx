import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';
import { DroneToggle } from './DroneToggle';

interface Props {
  selectedLabel: string;
  droneEnabled: boolean;
  onToggleDrone: () => void;
}

export const SruthiHeader = ({ selectedLabel, droneEnabled, onToggleDrone }: Props) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>Sruthi / Pitch</Text>
        <View style={styles.chip}><Text style={styles.chipText}>{selectedLabel}</Text></View>
      </View>
      <DroneToggle enabled={droneEnabled} onToggle={onToggleDrone} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: soundColors.gold, fontSize: 28, fontWeight: '600' },
  chip: { backgroundColor: '#2a251e', borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: soundColors.gold, fontSize: 10, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase' }
});
