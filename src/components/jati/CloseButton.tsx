import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { jatiColors } from '../../theme/jatiTheme';

interface Props {
  onPress: () => void;
}

export const CloseButton = ({ onPress }: Props) => (
  <Pressable onPress={onPress} style={styles.btn}><Text style={styles.txt}>Cancel & Close</Text></Pressable>
);

const styles = StyleSheet.create({
  btn: { borderWidth: 1, borderColor: jatiColors.border, borderRadius: 4, paddingHorizontal: 24, paddingVertical: 12 },
  txt: { color: jatiColors.textVariant, fontSize: 14, letterSpacing: 1.4, textTransform: 'uppercase' }
});
