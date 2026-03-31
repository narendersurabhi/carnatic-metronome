import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

export const BuilderHeader = () => (
  <View style={styles.wrap}>
    <Text style={styles.eyebrow}>Builder Mode</Text>
    <Text style={styles.title}>Custom Tala Sequence</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  eyebrow: { color: builderColors.textVariant, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  title: { color: builderColors.textPrimary, fontSize: 42, fontWeight: '700' }
});
