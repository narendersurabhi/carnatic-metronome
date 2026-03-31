import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { jatiColors, jatiTypography } from '../../theme/jatiTheme';

export const JatiSelectionHeader = () => (
  <View style={styles.wrap}>
    <Text style={styles.eyebrow}>Mathematical Foundation</Text>
    <Text style={styles.heading}>Select Jati</Text>
    <Text style={styles.subtitle}>Choose the rhythmic pulse that defines the number of aksharas per beat.</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: 34, alignItems: 'center' },
  eyebrow: { ...jatiTypography.eyebrow, color: jatiColors.textVariant, marginBottom: 8 },
  heading: { ...jatiTypography.heading, color: jatiColors.textPrimary, lineHeight: 52 },
  subtitle: { ...jatiTypography.subtitle, color: jatiColors.textVariant, textAlign: 'center', maxWidth: 320, marginTop: 12 }
});
