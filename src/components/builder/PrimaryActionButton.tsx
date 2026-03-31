import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const PrimaryActionButton = ({ label, onPress, disabled = false }: Props) => (
  <Pressable
    style={({ pressed }) => [styles.button, pressed && !disabled ? styles.pressed : null, disabled ? styles.disabled : null]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#e9c176', borderRadius: 4, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  text: { color: '#412d00', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' }
});
