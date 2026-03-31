import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const AngaBadge = ({ label, active = false }: { label: string; active?: boolean }) => (
  <View style={[styles.badge, active && styles.active]}><Text style={[styles.text, active && styles.textActive]}>{label}</Text></View>
);

const styles = StyleSheet.create({
  badge: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(78,70,57,0.4)', alignItems: 'center', justifyContent: 'center' },
  active: { borderColor: colors.gold, backgroundColor: 'rgba(233,193,118,0.15)' },
  text: { color: colors.textMuted, fontSize: 12 },
  textActive: { color: colors.gold }
});
