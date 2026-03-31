import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props { label: string; onPress: () => void }

export const PrimaryActionButton = ({ label, onPress }: Props) => (
  <Pressable style={styles.button} onPress={onPress}><Text style={styles.text}>{label}</Text></Pressable>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#e9c176', borderRadius: 4, paddingVertical: 18, alignItems: 'center' },
  text: { color: '#412d00', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' }
});
