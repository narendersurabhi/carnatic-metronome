import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props { label: string; onPress: () => void }

export const SecondaryActionButton = ({ label, onPress }: Props) => (
  <Pressable style={styles.button} onPress={onPress}><Text style={styles.text}>{label}</Text></Pressable>
);

const styles = StyleSheet.create({
  button: { flex: 1, backgroundColor: builderColors.surfaceHighest, borderRadius: 4, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  text: { color: builderColors.textPrimary, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.2, fontWeight: '700' }
});
