import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { zenColors, zenTypography } from '../../theme/zenTheme';

interface Props {
  jatiLabel: string;
  talaName: string;
  structureLabel: string;
}

export const TalaContextHeader = ({ jatiLabel, talaName, structureLabel }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.jati}>{jatiLabel}</Text>
      <Text style={styles.tala}>{talaName}</Text>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{structureLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 30 },
  jati: { ...zenTypography.jatiLabel, color: zenColors.textMuted, marginBottom: 8 },
  tala: { ...zenTypography.talaTitle, color: zenColors.textPrimary, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  chipText: { ...zenTypography.chip, color: zenColors.textSubtle }
});
