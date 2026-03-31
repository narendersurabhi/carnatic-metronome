import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { zenColors } from '../../theme/zenTheme';

export const TopBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftWrap}>
        <Text style={styles.icon}>♪</Text>
        <Text style={styles.brand}>LAYA</Text>
      </View>
      <Pressable style={styles.menuButton} accessibilityRole="button">
        <Text style={styles.menuText}>☰</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 72, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { color: zenColors.goldDim, fontSize: 18 },
  brand: { color: zenColors.goldDim, fontSize: 13, letterSpacing: 4, fontWeight: '700' },
  menuButton: { padding: 8 },
  menuText: { color: zenColors.textMuted, fontSize: 22 }
});
