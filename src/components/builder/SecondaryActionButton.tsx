import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const SecondaryActionButton = ({ label, onPress, disabled = false }: Props) => (
  <Pressable
    style={({ pressed }) => [styles.button, pressed && !disabled ? styles.pressed : null, disabled ? styles.disabled : null]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: builderColors.surfaceHighest,
    borderRadius: 4,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  pressed: { borderColor: builderColors.outline },
  disabled: { opacity: 0.45 },
  text: { color: builderColors.textPrimary, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.2, fontWeight: '700' }
});
