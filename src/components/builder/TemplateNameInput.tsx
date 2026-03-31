import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export const TemplateNameInput = ({ value, onChange }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.label}>Template Name</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Practice Varnam Slow"
      placeholderTextColor="rgba(78,70,57,0.5)"
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 320 },
  label: { color: '#9a8f80', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 10, marginBottom: 8 },
  input: { color: builderColors.textPrimary, borderBottomWidth: 1, borderBottomColor: builderColors.outline, paddingVertical: 8, fontSize: 24, fontStyle: 'italic' }
});
