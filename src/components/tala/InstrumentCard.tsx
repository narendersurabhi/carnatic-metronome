import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/tokens';

export const InstrumentCard = ({ title, subtitle, active, onPress }: { title: string; subtitle: string; active?: boolean; onPress: () => void }) => (
  <Pressable style={[styles.card, active && styles.active]} onPress={onPress}><Text style={[styles.title, active && styles.titleActive]}>{title}</Text><Text style={[styles.subtitle, active && styles.subtitleActive]}>{subtitle}</Text></Pressable>
);

const styles = StyleSheet.create({ card: { width: '48%', minHeight: 120, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(78,70,57,0.25)', borderRadius: 4, padding: 12 }, active: { borderColor: colors.gold }, title: { color: colors.text, fontSize: 24 }, titleActive: { color: colors.gold }, subtitle: { color: colors.textMuted, fontSize: 10, textTransform: 'uppercase' }, subtitleActive: { color: colors.gold } });
