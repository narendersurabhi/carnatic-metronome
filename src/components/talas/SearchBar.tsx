import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Quick Search"
        placeholderTextColor={talasColors.textVariant}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { backgroundColor: talasColors.surfaceContainer, borderRadius: 4, height: 54, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  icon: { color: talasColors.textVariant, fontSize: 20, marginRight: 10 },
  input: { flex: 1, color: talasColors.textPrimary, fontSize: 15 }
});
