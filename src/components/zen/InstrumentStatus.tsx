import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { zenColors } from '../../theme/zenTheme';

interface Props {
  instrument: string;
}

export const InstrumentStatus = ({ instrument }: Props) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.icon}>◉</Text>
      <Text style={styles.text}>{instrument}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 0.45 },
  icon: { color: zenColors.textPrimary, fontSize: 10 },
  text: { color: zenColors.textPrimary, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }
});
