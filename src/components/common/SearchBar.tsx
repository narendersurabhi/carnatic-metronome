import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <View style={styles.wrap}><Text style={styles.icon}>⌕</Text><TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Quick Search" placeholderTextColor={colors.textMuted} /></View>
);

const styles = StyleSheet.create({
  wrap: { height: 52, backgroundColor: colors.surface, borderRadius: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  icon: { color: colors.textMuted, marginRight: 10, fontSize: 18 },
  input: { flex: 1, color: colors.text }
});
