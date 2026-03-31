import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

interface Props {
  label: string;
  highlighted?: boolean;
}

export const AngaBadge = ({ label, highlighted = false }: Props) => (
  <View style={[styles.badge, highlighted ? styles.hl : styles.idle]}>
    <Text style={[styles.text, highlighted ? styles.textHl : styles.textIdle]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  idle: { borderWidth: 1, borderColor: talasColors.borderSoft },
  hl: { borderWidth: 1, borderColor: talasColors.gold, backgroundColor: 'rgba(233,193,118,0.15)' },
  text: { fontSize: 12 },
  textIdle: { color: talasColors.textVariant, opacity: 0.8 },
  textHl: { color: talasColors.gold }
});
