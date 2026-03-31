import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const SectionHeader = ({ title, caption }: { title: string; caption?: string }) => (
  <View style={styles.row}><Text style={styles.title}>{title}</Text>{caption ? <Text style={styles.caption}>{caption}</Text> : null}</View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: 'rgba(233,193,118,0.2)', paddingBottom: 8 },
  title: { color: colors.gold, fontSize: 28, fontWeight: '600' },
  caption: { color: colors.textMuted, fontSize: 10, letterSpacing: 1.4, opacity: 0.7 }
});
