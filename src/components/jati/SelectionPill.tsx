import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { jatiColors } from '../../theme/jatiTheme';

export const SelectionPill = () => (
  <View style={styles.pill}><Text style={styles.text}>ACTIVE</Text></View>
);

const styles = StyleSheet.create({
  pill: { backgroundColor: jatiColors.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  text: { color: jatiColors.gold, fontSize: 11, fontWeight: '700' }
});
