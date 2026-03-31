import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const PulsePreview = ({ count, active }: { count: number; active?: boolean }) => (
  <View style={styles.wrap}>{Array.from({ length: count }).map((_, i) => <View key={i} style={[styles.dot, active ? styles.active : styles.idle]} />)}</View>
);

const styles = StyleSheet.create({ wrap: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', maxWidth: 100, justifyContent: 'flex-end' }, dot: { width: 10, height: 10, borderRadius: 5 }, active: { backgroundColor: colors.gold }, idle: { backgroundColor: colors.outline } });
