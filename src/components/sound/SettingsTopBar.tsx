import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';

export const SettingsTopBar = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>☰</Text>
      <View style={styles.brandWrap}>
        <Text style={styles.brandTitle}>Laya & Temple</Text>
        <Text style={styles.brandMonogram}>L&T</Text>
      </View>
      <View style={styles.templeCircle}>
        <Text style={styles.templeIcon}>⌂</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: soundColors.background
  },
  icon: { color: soundColors.gold, fontSize: 24 },
  brandWrap: { alignItems: 'center' },
  brandTitle: { color: soundColors.textPrimary, textTransform: 'uppercase', fontSize: 13 },
  brandMonogram: { color: soundColors.gold, fontSize: 28, fontWeight: '700', letterSpacing: 2 },
  templeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: soundColors.borderStrong,
    backgroundColor: soundColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  templeIcon: { color: soundColors.gold, fontSize: 16 }
});
