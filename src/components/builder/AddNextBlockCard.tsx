import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

interface Props { onPress: () => void }

export const AddNextBlockCard = ({ onPress }: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Text style={styles.icon}>⊕</Text>
    <Text style={styles.text}>Add Next</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { width: 132, height: 192, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(78,70,57,0.5)', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  icon: { color: '#9a8f80', fontSize: 24, marginBottom: 6 },
  text: { color: '#9a8f80', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 10, fontWeight: '700' }
});
